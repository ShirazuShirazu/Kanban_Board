'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="modal-content modal-content-small" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 id="confirm-modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <div className="modal-form">
          <p className="confirm-message">{message}</p>

          {/* Actions */}
          <div className="modal-actions">
            <button onClick={onClose} className="btn btn-secondary">
              {cancelText}
            </button>
            <button 
              onClick={onConfirm} 
              className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
