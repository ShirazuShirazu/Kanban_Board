'use client';

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
}

export function KanbanColumn({
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className={`
        flex flex-col min-w-[300px] w-[300px] max-w-[300px]
        bg-gray-100 rounded-lg p-4
        transition-colors duration-200
        ${isOver ? 'bg-blue-50 ring-2 ring-blue-400 ring-inset' : ''}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800">{column.title}</h3>
          <span
            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium"
            aria-label={`${tasks.length} tasks in ${column.title}`}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
          aria-label={`Add task to ${column.title}`}
          title={`Add task to ${column.title}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-[200px] space-y-2
          ${isOver ? 'bg-blue-50/50' : ''}
        `}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-sm">No tasks</span>
              <button
                onClick={() => onAddTask(column.id)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Add a task
              </button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
