import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI } from '../services/api';
import type { Movie } from '../services/api';
import './MovieList.css';

function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 8; // Movies per page

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getList({ page: currentPage, limit });
      setMovies(response.movies || []);
      setTotalPages(response.totalPages || 1);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    navigate('/movies/create');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="movie-list-container">
        <div style={{ color: 'white' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      {/* Header */}
      <div className="movie-list-header">
        <div className="header-left">
          <h1 className="page-title">My movies</h1>
          <button className="create-movie-icon-button" onClick={handleAddMovie} title="Add movie">
            <span className="plus-icon">+</span>
          </button>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
          <span className="logout-icon">→</span>
        </button>
      </div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="empty-movie-state">
          <h2 className="empty-message">Your movie list is empty</h2>
          <button className="add-movie-button" onClick={handleAddMovie}>
            Add a new movie
          </button>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie._id} className="movie-card">
                <div className="movie-image-container">
                  <img 
                    src={movie.imageURL || 'https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU'} 
                    alt={movie.title}
                    className="movie-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU';
                    }}
                  />
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.publishYear}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MovieList;

