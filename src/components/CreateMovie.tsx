import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateMovie.css';

function CreateMovie() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [publishingYear, setPublishingYear] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Movie data:', { title, publishingYear, image: selectedImage });
    // Handle movie creation logic here
    // After successful creation, navigate back to movies list
    // navigate('/movies');
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
                  type="text"
                  id="publishing-year"
                  placeholder="Publishing year"
                  value={publishingYear}
                  onChange={(e) => setPublishingYear(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

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
                >
                  Submit
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



