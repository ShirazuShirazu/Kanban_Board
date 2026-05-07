import { useState, useMemo, useCallback } from 'react';
import { Task, Priority, FilterState } from '../types';

export function useTaskFilter(tasks: Task[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priorityFilter: 'All',
  });
  const [isSearching, setIsSearching] = useState(false);

  // Submit search with simulated delay for spinner
  const submitSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    
    // Simulate a small delay to show the spinner (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    setIsSearching(false);
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
    isSearching,
    submitSearch,
    setPriorityFilter,
    clearFilters,
    hasActiveFilters,
  };
}