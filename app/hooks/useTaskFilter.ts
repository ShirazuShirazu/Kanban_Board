import { useState, useMemo, useCallback } from 'react';
import { Task, Priority, FilterState } from '../types';

export function useTaskFilter(tasks: Task[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priorityFilter: 'All',
  });

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setPriorityFilter = useCallback((priority: Priority | 'All') => {
    setFilters((prev) => ({ ...prev, priorityFilter: priority }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      priorityFilter: 'All',
    });
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Apply priority filter
      if (filters.priorityFilter !== 'All' && task.priority !== filters.priorityFilter) {
        return false;
      }

      // Apply search filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  const hasActiveFilters = useMemo(() => {
    return filters.searchQuery !== '' || filters.priorityFilter !== 'All';
  }, [filters]);

  return {
    filters,
    filteredTasks,
    setSearchQuery,
    setPriorityFilter,
    clearFilters,
    hasActiveFilters,
  };
}
