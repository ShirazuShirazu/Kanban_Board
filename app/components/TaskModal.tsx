'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Task, Priority, Column } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
  columns: Column[];
  defaultColumnId?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  assignee?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
  columns,
  defaultColumnId,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignee, setAssignee] = useState('');
  const [columnId, setColumnId] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isEditing = !!task;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setAssignee(task.assignee);
        setColumnId(task.columnId);
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setAssignee('');
        setColumnId(defaultColumnId || columns[0]?.id || '');
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, task, columns, defaultColumnId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    } else if (assignee.length < 2) {
      newErrors.assignee = 'Assignee must be at least 2 characters';
    } else if (assignee.length > 50) {
      newErrors.assignee = 'Assignee must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true, assignee: true });

    if (validate()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        priority,
        assignee: assignee.trim(),
        columnId,
      });
      onClose();
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 id="task-modal-title">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
              placeholder="Enter task title"
              maxLength={100}
            />
            {errors.title && touched.title && <p className="form-error">{errors.title}</p>}
            <p className="form-hint">{title.length}/100</p>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
              placeholder="Enter task description"
              maxLength={500}
            />
            {errors.description && touched.description && <p className="form-error">{errors.description}</p>}
            <p className="form-hint">{description.length}/500</p>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority <span className="required">*</span>
            </label>
            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="form-select">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label htmlFor="assignee" className="form-label">
              Assignee <span className="required">*</span>
            </label>
            <input
              type="text"
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              onBlur={() => handleBlur('assignee')}
              className={`form-input ${errors.assignee && touched.assignee ? 'error' : ''}`}
              placeholder="Enter assignee name"
              maxLength={50}
            />
            {errors.assignee && touched.assignee && <p className="form-error">{errors.assignee}</p>}
          </div>

          {/* Column */}
          <div className="form-group">
            <label htmlFor="column" className="form-label">
              Column <span className="required">*</span>
            </label>
            <select id="column" value={columnId} onChange={(e) => setColumnId(e.target.value)} className="form-select">
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}