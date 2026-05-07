'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, Task } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  canDelete: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  canDelete,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    onEditColumn(column);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDeleteColumn(column.id);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`kanban-column ${isOver ? 'drag-over' : ''}`}>
      {/* Column Header */}
      <div className="column-header">
        <div className="column-title-group">
          <h3 className="column-title">{column.title}</h3>
          <span className="column-count" aria-label={`${tasks.length} tasks in ${column.title}`}>
            {tasks.length}
          </span>
        </div>
        <div className="column-actions">
          <button
            onClick={() => onAddTask(column.id)}
            className="column-add-btn"
            aria-label={`Add task to ${column.title}`}
            title={`Add task to ${column.title}`}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {/* Column Menu */}
          <div className="column-menu-container">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="column-menu-btn"
              aria-label="Column options"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="column-menu">
                <button onClick={handleEdit} className="column-menu-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Column
                </button>
                {canDelete && (
                  <>
                    {showDeleteConfirm ? (
                      <div className="column-menu-confirm">
                        <span>Delete?</span>
                        <button onClick={handleDelete} className="confirm-yes">Yes</button>
                        <button onClick={handleCancelDelete} className="confirm-no">No</button>
                      </div>
                    ) : (
                      <button onClick={handleDelete} className="column-menu-item delete">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Column
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Container */}
      <div ref={setNodeRef} className="column-tasks">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="empty-column">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>No tasks</span>
              <button onClick={() => onAddTask(column.id)}>Add a task</button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
