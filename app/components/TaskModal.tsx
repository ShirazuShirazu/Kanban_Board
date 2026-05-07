'use client';

import { useState, useEffect } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="task-modal-title"
            className="text-xl font-bold text-gray-900"
          >
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title && touched.title
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter task title"
              maxLength={100}
            />
            {errors.title && touched.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 text-right">
              {title.length}/100
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description && touched.description
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter task description"
              maxLength={500}
            />
            {errors.description && touched.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label
              htmlFor="assignee"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assignee <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              onBlur={() => handleBlur('assignee')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.assignee && touched.assignee
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter assignee name"
              maxLength={50}
            />
            {errors.assignee && touched.assignee && (
              <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
            )}
          </div>

          {/* Column */}
          <div>
            <label
              htmlFor="column"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column <span className="text-red-500">*</span>
            </label>
            <select
              id="column"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
