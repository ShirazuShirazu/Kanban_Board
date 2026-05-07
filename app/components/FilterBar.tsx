'use client';

import { useState, FormEvent } from 'react';
import { Priority } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  priorityFilter: Priority | 'All';
  onPriorityChange: (priority: Priority | 'All') => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  taskCount: number;
  filteredCount: number;
  isSearching?: boolean;
}

export function FilterBar({
  searchQuery,
  onSearchSubmit,
  priorityFilter,
  onPriorityChange,
  hasActiveFilters,
  onClearFilters,
  taskCount,
  filteredCount,
  isSearching = false,
}: FilterBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onClearFilters();
  };

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="search-input"
              aria-label="Search tasks"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="search-btn"
            aria-label="Search"
          >
            {isSearching ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {/* Priority Filter */}
        <div className="filters-group">
          <label htmlFor="priority-filter" className="filter-label">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as Priority | 'All')}
            className="filter-select"
            aria-label="Filter by priority"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button onClick={handleClear} className="btn btn-danger" aria-label="Clear all filters">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span>Active filters:</span>
          {searchQuery && (
            <span className="filter-badge search">
              Search: &quot;{searchQuery}&quot;
            </span>
          )}
          {priorityFilter !== 'All' && (
            <span className="filter-badge priority">
              Priority: {priorityFilter}
            </span>
          )}
        </div>
      )}

      {/* Task Count */}
      <div className="task-count-display">
        Showing {filteredCount} of {taskCount} tasks
      </div>
    </div>
  );
}