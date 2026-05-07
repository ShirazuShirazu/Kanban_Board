'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, Column } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { ColumnModal } from './ColumnModal';
import { FilterBar } from './FilterBar';
import { TaskCard } from './TaskCard';
import { useTaskFilter } from '../hooks/useTaskFilter';
import { ConfirmModal } from './ConfirmModal';

interface KanbanBoardProps {
  tasks: Task[];
  columns: Column[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newColumnId: string, newIndex?: number) => void;
  onReorderTask: (columnId: string, oldIndex: number, newIndex: number) => void;
  onAddColumn: (title: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function KanbanBoard({
  tasks,
  columns,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onReorderTask,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<string>('');
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    filters,
    filteredTasks,
    isSearching,
    submitSearch,
    setPriorityFilter,
    clearFilters,
    hasActiveFilters,
  } = useTaskFilter(tasks);

  // Group filtered tasks by column
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    columns.forEach((col) => {
      grouped[col.id] = filteredTasks.filter((t) => t.columnId === col.id);
    });
    return grouped;
  }, [filteredTasks, columns]);

  // All tasks grouped by column (for drag operations)
  const allTasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    columns.forEach((col) => {
      grouped[col.id] = tasks.filter((t) => t.columnId === col.id);
    });
    return grouped;
  }, [tasks, columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTask = useMemo(() => tasks.find((t) => t.id === activeId) || null, [activeId, tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;
    const activeTaskItem = tasks.find((t) => t.id === activeTaskId);
    if (!activeTaskItem) return;

    const overColumn = columns.find((c) => c.id === overId);
    const overTask = tasks.find((t) => t.id === overId);

    if (overColumn && activeTaskItem.columnId !== overColumn.id) {
      onMoveTask(activeTaskId, overColumn.id);
    } else if (overTask && overTask.id !== activeTaskId && activeTaskItem.columnId !== overTask.columnId) {
      onMoveTask(activeTaskId, overTask.columnId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTaskId = active.id as string;
    const overId = over.id as string;
    const activeTaskItem = tasks.find((t) => t.id === activeTaskId);
    
    if (!activeTaskItem) {
      setActiveId(null);
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && overTask.id !== activeTaskId) {
      const columnTasks = allTasksByColumn[activeTaskItem.columnId];
      const oldIndex = columnTasks.findIndex((t) => t.id === activeTaskId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderTask(activeTaskItem.columnId, oldIndex, newIndex);
      }
    }

    setActiveId(null);
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setDefaultColumnId('');
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData as Omit<Task, 'id' | 'createdAt'>);
    }
  };

  // Column management
  const handleAddColumn = () => {
    setEditingColumn(null);
    setIsColumnModalOpen(true);
  };

  const handleEditColumn = (column: Column) => {
    setEditingColumn(column);
    setIsColumnModalOpen(true);
  };

  const handleColumnModalClose = () => {
    setIsColumnModalOpen(false);
    setEditingColumn(null);
  };

  const handleSaveColumn = (title: string) => {
    if (editingColumn) {
      onUpdateColumn(editingColumn.id, title);
    } else {
      onAddColumn(title);
    }
  };

  // Task delete confirmation
  const handleDeleteTaskRequest = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setDeletingTask(task);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      onDeleteTask(deletingTask.id);
      setDeletingTask(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletingTask(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="kanban-board">
      {/* Filters */}
      <FilterBar
        searchQuery={filters.searchQuery}
        onSearchSubmit={submitSearch}
        priorityFilter={filters.priorityFilter}
        onPriorityChange={setPriorityFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        taskCount={tasks.length}
        filteredCount={filteredTasks.length}
        isSearching={isSearching}
      />

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board-container">
          <div className="board-columns">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn[column.id] || []}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTaskRequest}
                onAddTask={handleAddTask}
                onEditColumn={handleEditColumn}
                onDeleteColumn={onDeleteColumn}
                canDelete={columns.length > 1}
              />
            ))}
            
            {/* Add Column Button */}
            <button onClick={handleAddColumn} className="add-column-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Column</span>
            </button>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="drag-overlay-card">
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onSave={handleSaveTask}
        task={editingTask}
        columns={columns}
        defaultColumnId={defaultColumnId}
      />

      {/* Column Modal */}
      <ColumnModal
        isOpen={isColumnModalOpen}
        onClose={handleColumnModalClose}
        onSave={handleSaveColumn}
        column={editingColumn}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={deletingTask ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
