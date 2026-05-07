'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const priorityClass = `priority-${task.priority.toLowerCase()}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${priorityClass} ${isDragging ? 'dragging' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. Priority: ${task.priority}. Assigned to: ${task.assignee}`}
    >
      {/* Header */}
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <span className={`task-priority-badge ${priorityClass}`}>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <div className="task-description">
        <p>{task.description}</p>
      </div>

      {/* Footer */}
      <div className="task-footer">
        <div className="task-assignee">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{task.assignee}</span>
        </div>
        <span>{formattedDate}</span>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          onClick={() => onEdit(task)}
          onPointerDown={(e) => e.stopPropagation()}
          className="task-btn task-btn-edit"
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className="task-btn task-btn-delete"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}