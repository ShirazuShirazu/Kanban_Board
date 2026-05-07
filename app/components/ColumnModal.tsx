'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Column } from '../types';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  column?: Column | null;
}

export function ColumnModal({ isOpen, onClose, onSave, column }: ColumnModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!column;

  useEffect(() => {
    if (isOpen) {
      if (column) {
        setTitle(column.title);
      } else {
        setTitle('');
      }
      setError('');
    }
  }, [isOpen, column]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Column title is required');
      return;
    }

    if (title.trim().length < 2) {
      setError('Column title must be at least 2 characters');
      return;
    }

    if (title.trim().length > 50) {
      setError('Column title must be less than 50 characters');
      return;
    }

    onSave(title.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="column-modal-title">
      <div className="modal-content modal-content-small" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 id="column-modal-title">{isEditing ? 'Edit Column' : 'Add New Column'}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="column-title" className="form-label">
              Column Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="column-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="Enter column title (e.g., Testing, Deployed)"
              maxLength={50}
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
            <p className="form-hint">{title.length}/50</p>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Column'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
