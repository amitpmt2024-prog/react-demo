import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { moviesAPI, uploadAPI } from '../services/api';
import './EditMovie.css';

function EditMovie() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [publishingYear, setPublishingYear] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      // No token found, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const fetchMovie = useCallback(async () => {
    try {
      setFetching(true);
      const response = await moviesAPI.getOne(id!);
      const movie = response.movie;
      
      setTitle(movie.title || '');
      setPublishingYear(movie.publishYear?.toString() || '');
      const imageUrl = movie.imageURL || null;
      setSelectedImage(imageUrl);
      setOriginalImageURL(imageUrl);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch movie. Please try again.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[]; error?: string } } };
        if (axiosError.response?.data) {
          if (axiosError.response.data.message) {
            errorMessage = Array.isArray(axiosError.response.data.message) 
              ? axiosError.response.data.message[0] 
              : axiosError.response.data.message;
          } else if (axiosError.response.data.error) {
            errorMessage = axiosError.response.data.error;
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMovie();
    } else {
      setError('Movie ID is missing');
      setFetching(false);
    }
  }, [id, fetchMovie]);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate title
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        setError('Title is required');
        setLoading(false);
        return;
      }
      if (trimmedTitle.length > 200) {
        setError('Title cannot exceed 200 characters');
        setLoading(false);
        return;
      }

      // Validate publishing year
      if (!publishingYear || !publishingYear.trim()) {
        setError('Publishing year is required');
        setLoading(false);
        return;
      }
      const year = parseInt(publishingYear, 10);
      if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 1) {
        setError('Please enter a valid publishing year (1888 to ' + (new Date().getFullYear() + 1) + ')');
        setLoading(false);
        return;
      }

      let imageURL = originalImageURL;

      // If a new image was selected, upload it
      if (selectedFile) {
        const uploadResponse = await uploadAPI.uploadImage(selectedFile);
        // In production (same origin), use relative path; in dev, use full URL
        imageURL = uploadResponse.imageURL.startsWith('http')
          ? uploadResponse.imageURL
          : `${window.location.origin}${uploadResponse.imageURL}`;
      }

      // If no image exists and no new image was selected, show error
      if (!imageURL) {
        setError('Please select an image');
        setLoading(false);
        return;
      }

      const movieData = {
        title: trimmedTitle,
        publishYear: year,
        imageURL: imageURL,
      };

      const response = await moviesAPI.update(id!, movieData);

      // Show success toast
      toast.success(response.message || 'Movie updated successfully!');

      // Navigate back to movies list on success
      navigate('/movies');
    } catch (err: unknown) {
      // Extract error message from different response formats
      let errorMessage = 'Failed to update movie. Please try again.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[]; error?: string } } };
        if (axiosError.response?.data) {
          if (axiosError.response.data.message) {
            errorMessage = Array.isArray(axiosError.response.data.message) 
              ? axiosError.response.data.message[0] 
              : axiosError.response.data.message;
          } else if (axiosError.response.data.error) {
            errorMessage = axiosError.response.data.error;
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Set error state for inline display
      setError(errorMessage);
      
      // Show error toast notification
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/movies');
  };

  if (fetching) {
    return (
      <div className="edit-movie-container">
        <div style={{ color: 'white' }}>Loading movie data...</div>
      </div>
    );
  }

  return (
    <div className="edit-movie-container">
      <div className="edit-movie-box">
        <h1 className="edit-movie-title">Edit</h1>
        
        <form className="edit-movie-form" onSubmit={handleSubmit}>
          <div className="form-content">
            {/* Image Upload Zone */}
            <div className="image-upload-zone">
              <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDrop={handleImageDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="file-input"
                />
                {selectedImage ? (
                  <div className="image-preview">
                    <img src={selectedImage} alt="Preview" />
                  </div>
                ) : (
                  <div className="drop-zone-content">
                    <div className="arrow-icon">↓</div>
                    <p className="drop-text">Drop other image here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="form-fields">
              <div className="input-field">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="publishing-year" className="form-label">Publishing year</label>
                <input
                  type="number"
                  id="publishing-year"
                  placeholder="Publishing year"
                  value={publishingYear}
                  onChange={(e) => setPublishingYear(e.target.value)}
                  className="form-input"
                  min="1888"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              {error && (
                <div className="error-message" style={{ color: 'red', marginTop: '10px', marginBottom: '10px' }}>
                  {error}
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="update-button"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMovie;


