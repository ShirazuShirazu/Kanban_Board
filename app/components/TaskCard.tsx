'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, PRIORITY_COLORS, PRIORITY_BADGE_COLORS } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    opacity: isDragging ? 0.5 : 1,
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative p-4 mb-3 rounded-lg border border-l-4 shadow-sm cursor-grab active:cursor-grabbing
        bg-white hover:shadow-md transition-shadow
        ${PRIORITY_COLORS[task.priority]}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. Priority: ${task.priority}. Assigned to: ${task.assignee}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
          {task.title}
        </h4>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${PRIORITY_BADGE_COLORS[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description - truncated or expanded */}
      <div className="mb-3">
        <p
          className={`text-sm text-gray-600 ${
            isExpanded ? '' : 'line-clamp-2'
          }`}
        >
          {task.description}
        </p>
        {task.description.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1 underline"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="truncate max-w-[100px]">{task.assignee}</span>
          </div>
        </div>
        <span>{formattedDate}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {showDeleteConfirm ? (
          <>
            <span className="text-xs text-red-600">Confirm delete?</span>
            <button
              onClick={handleDelete}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={handleCancelDelete}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              No
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(task)}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              aria-label="Edit task"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              aria-label="Delete task"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Dragging overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg border-2 border-blue-400 border-dashed pointer-events-none" />
      )}
    </div>
  );
}
