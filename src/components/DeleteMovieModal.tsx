import './DeleteMovieModal.css';

interface DeleteMovieModalProps {
  isOpen: boolean;
  movieTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function DeleteMovieModal({ isOpen, movieTitle, onConfirm, onCancel, loading = false }: DeleteMovieModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Delete Movie</h2>
        <p className="modal-message">
          Are you sure you want to delete <strong>"{movieTitle}"</strong>?
        </p>
        <div className="modal-buttons">
          <button
            type="button"
            className="modal-button cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-button delete-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMovieModal;

