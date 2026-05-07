import { BoardState, Task, DEFAULT_COLUMNS } from '../types';

export interface PersistenceLayer {
  load(): BoardState | null;
  save(state: BoardState): void;
  clear(): void;
}

const STORAGE_KEY = 'kanban-board-state';

export class LocalStoragePersistence implements PersistenceLayer {
  load(): BoardState | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data) as BoardState;
      
      // Ensure columns exist (migration support)
      if (!parsed.columns || parsed.columns.length === 0) {
        parsed.columns = DEFAULT_COLUMNS;
      }
      
      return parsed;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  save(state: BoardState): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Factory function to create persistence layer - easy to swap for API later
export function createPersistenceLayer(): PersistenceLayer {
  return new LocalStoragePersistence();
}