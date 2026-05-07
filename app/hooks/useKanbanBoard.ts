import { useState, useEffect, useCallback } from 'react';
import { Task, Column, BoardState, DEFAULT_COLUMNS } from '../types';
import { createPersistenceLayer } from '../lib/persistence';

const persistence = createPersistenceLayer();

export function useKanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from persistence on mount
  useEffect(() => {
    const saved = persistence.load();
    if (saved) {
      setTasks(saved.tasks);
      setColumns(saved.columns);
    }
    setIsLoaded(true);
  }, []);

  // Save to persistence whenever state changes
  useEffect(() => {
    if (isLoaded) {
      persistence.save({ tasks, columns });
    }
  }, [tasks, columns, isLoaded]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const moveTask = useCallback((taskId: string, newColumnId: string, newIndex?: number) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      const newTasks = [...prev];
      
      // Remove task from current position
      newTasks.splice(taskIndex, 1);
      
      // Update task with new column
      const updatedTask = { ...task, columnId: newColumnId };
      
      // Get tasks in target column
      const columnTasks = newTasks.filter((t) => t.columnId === newColumnId);
      const otherTasks = newTasks.filter((t) => t.columnId !== newColumnId);
      
      // Insert at specified index or at the end
      const insertIndex = newIndex !== undefined 
        ? Math.min(newIndex, columnTasks.length)
        : columnTasks.length;
      
      columnTasks.splice(insertIndex, 0, updatedTask);
      
      return [...otherTasks, ...columnTasks];
    });
  }, []);

  const reorderTask = useCallback((columnId: string, oldIndex: number, newIndex: number) => {
    setTasks((prev) => {
      const columnTasks = prev.filter((t) => t.columnId === columnId);
      const otherTasks = prev.filter((t) => t.columnId !== columnId);
      
      if (oldIndex < 0 || oldIndex >= columnTasks.length) return prev;
      if (newIndex < 0 || newIndex >= columnTasks.length) return prev;
      
      const [movedTask] = columnTasks.splice(oldIndex, 1);
      columnTasks.splice(newIndex, 0, movedTask);
      
      return [...otherTasks, ...columnTasks];
    });
  }, []);

  const clearBoard = useCallback(() => {
    setTasks([]);
    setColumns(DEFAULT_COLUMNS);
    persistence.clear();
  }, []);

  // Column management
  const addColumn = useCallback((title: string) => {
    const newColumn: Column = {
      id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
    };
    setColumns((prev) => [...prev, newColumn]);
    return newColumn;
  }, []);

  const updateColumn = useCallback((columnId: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, title: title.trim() } : col
      )
    );
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    // Move all tasks from this column to the first remaining column
    setTasks((prev) => {
      const remainingColumns = columns.filter((c) => c.id !== columnId);
      const fallbackColumnId = remainingColumns[0]?.id;
      
      if (!fallbackColumnId) return prev;
      
      return prev.map((task) =>
        task.columnId === columnId
          ? { ...task, columnId: fallbackColumnId }
          : task
      );
    });
    
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  }, [columns]);

  const reorderColumns = useCallback((oldIndex: number, newIndex: number) => {
    setColumns((prev) => {
      if (oldIndex < 0 || oldIndex >= prev.length) return prev;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newColumns = [...prev];
      const [movedColumn] = newColumns.splice(oldIndex, 1);
      newColumns.splice(newIndex, 0, movedColumn);
      
      return newColumns;
    });
  }, []);

  return {
    tasks,
    columns,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    clearBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
  };
}
