import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { moviesAPI, uploadAPI } from '../services/api';
import './CreateMovie.css';

function CreateMovie() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [publishingYear, setPublishingYear] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Check if form is valid
  const isFormValid = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length > 200) return false;
    if (!publishingYear || !publishingYear.trim()) return false;
    const year = parseInt(publishingYear, 10);
    if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 1) return false;
    if (!selectedFile) return false;
    return true;
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

      // Validate image is selected
      if (!selectedFile) {
        setError('Please select an image');
        setLoading(false);
        return;
      }

      // Upload image first
      const uploadResponse = await uploadAPI.uploadImage(selectedFile);
      const imageURL = `http://localhost:3000${uploadResponse.imageURL}`;

      // Create movie with uploaded image URL
      const movieData = {
        title: trimmedTitle,
        publishYear: year,
        imageURL: imageURL,
      };

      const response = await moviesAPI.create(movieData);

      // Show success toast
      toast.success(response.message || 'Movie created successfully!');

      // Navigate back to movies list on success
      navigate('/movies');
    } catch (err: unknown) {
      // Extract error message from different response formats
      let errorMessage = 'Failed to create movie. Please try again.';
      
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

  return (
    <div className="create-movie-container">
      <div className="create-movie-box">
        <h1 className="create-movie-title">Create a new movie</h1>
        
        <form className="create-movie-form" onSubmit={handleSubmit}>
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
                    <p className="drop-text">Drop an image here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="form-fields">
              <div className="input-field">
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
                  className="submit-button"
                  disabled={loading || !isFormValid()}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMovie;



