import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { moviesAPI } from '../services/api';
import type { Movie } from '../services/api';
import DeleteMovieModal from './DeleteMovieModal';
import './MovieList.css';

function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 8; // Movies per page
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; movieId: string; movieTitle: string }>({
    isOpen: false,
    movieId: '',
    movieTitle: '',
  });
  const [deleting, setDeleting] = useState(false);

  const fetchMovies = useCallback(async () => {
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
  }, [currentPage, limit]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

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

  const handleDeleteClick = (e: React.MouseEvent, movieId: string, movieTitle: string) => {
    e.stopPropagation(); // Prevent triggering the edit navigation
    setDeleteModal({
      isOpen: true,
      movieId,
      movieTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await moviesAPI.delete(deleteModal.movieId);
      toast.success('Movie deleted successfully!');
      setDeleteModal({ isOpen: false, movieId: '', movieTitle: '' });
      // Refresh the movie list
      await fetchMovies();
    } catch (err: unknown) {
      let errorMessage = 'Failed to delete movie. Please try again.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        if (axiosError.response?.data?.message) {
          errorMessage = Array.isArray(axiosError.response.data.message)
            ? axiosError.response.data.message[0]
            : axiosError.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, movieId: '', movieTitle: '' });
  };

  if (loading) {
    return (
      <div className="">
        <div style={{ color: 'white' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="">
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
              <div 
                key={movie._id} 
                className="movie-card"
                onClick={() => navigate(`/movies/${movie._id}/edit`)}
              >
                <div className="movie-image-container">
                  <img 
                    src={movie.imageURL || 'https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU'} 
                    alt={movie.title}
                    className="movie-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU';
                    }}
                  />
                  <button
                    className="delete-movie-button"
                    onClick={(e) => handleDeleteClick(e, movie._id, movie.title)}
                    title="Delete movie"
                  >
                    ×
                  </button>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.publishYear}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Record Count */}
          {total > 0 && (
            <div className="record-count">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} movies
            </div>
          )}

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

      {/* Delete Confirmation Modal */}
      <DeleteMovieModal
        isOpen={deleteModal.isOpen}
        movieTitle={deleteModal.movieTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleting}
      />
    </div>
  );
}

export default MovieList;

