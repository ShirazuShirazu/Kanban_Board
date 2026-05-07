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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, Column } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { FilterBar } from './FilterBar';
import { TaskCard } from './TaskCard';
import { useTaskFilter } from '../hooks/useTaskFilter';

interface KanbanBoardProps {
  tasks: Task[];
  columns: Column[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newColumnId: string, newIndex?: number) => void;
  onReorderTask: (columnId: string, oldIndex: number, newIndex: number) => void;
}

export function KanbanBoard({
  tasks,
  columns,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onReorderTask,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<string>('');

  const {
    filters,
    filteredTasks,
    setSearchQuery,
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
      activationConstraint: {
        distance: 5, // Minimum drag distance before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeId) || null,
    [activeId, tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTaskItem = tasks.find((t) => t.id === activeTaskId);
    if (!activeTaskItem) return;

    // Check if we're over a column
    const overColumn = columns.find((c) => c.id === overId);
    
    // Check if we're over another task
    const overTask = tasks.find((t) => t.id === overId);

    if (overColumn) {
      // Dragging over a different column
      if (activeTaskItem.columnId !== overColumn.id) {
        onMoveTask(activeTaskId, overColumn.id);
      }
    } else if (overTask && overTask.id !== activeTaskId) {
      // Dragging over another task
      if (activeTaskItem.columnId !== overTask.columnId) {
        // Moving to a different column
        onMoveTask(activeTaskId, overTask.columnId);
      }
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

    // If over a task, reorder within the column
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
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <FilterBar
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={filters.priorityFilter}
        onPriorityChange={setPriorityFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        taskCount={tasks.length}
        filteredCount={filteredTasks.length}
      />

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-6 h-full min-w-max p-1">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn[column.id] || []}
                onEditTask={handleEditTask}
                onDeleteTask={onDeleteTask}
                onAddTask={handleAddTask}
              />
            ))}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="opacity-90 rotate-2 scale-105">
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveTask}
        task={editingTask}
        columns={columns}
        defaultColumnId={defaultColumnId}
      />
    </div>
  );
}
