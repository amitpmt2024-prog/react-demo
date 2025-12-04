import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieList.css';

function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);

  const handleAddMovie = () => {
    navigate('/movies/create');
  };

  return (
    <div className="movie-list-container">
      {movies.length === 0 ? (
        <div className="empty-movie-state">
          <h2 className="empty-message">Your movie list is empty</h2>
          <button className="add-movie-button" onClick={handleAddMovie}>
            Add a new movie
          </button>
        </div>
      ) : (
        <div className="movies-grid">
          {/* Movies will be displayed here when available */}
        </div>
      )}
    </div>
  );
}

export default MovieList;

