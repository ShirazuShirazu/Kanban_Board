import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStoragePersistence } from '../lib/persistence';
import { BoardState, DEFAULT_COLUMNS } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStoragePersistence', () => {
  let persistence: LocalStoragePersistence;

  beforeEach(() => {
    persistence = new LocalStoragePersistence();
    vi.clearAllMocks();
  });

  describe('load', () => {
    it('should return null when no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = persistence.load();
      
      expect(result).toBeNull();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('kanban-board-state');
    });

    it('should return parsed data when it exists', () => {
      const mockState: BoardState = {
        tasks: [
          {
            id: '1',
            title: 'Test Task',
            description: 'Test Description',
            priority: 'Medium',
            assignee: 'John Doe',
            createdAt: '2024-01-01T00:00:00.000Z',
            columnId: 'todo',
          },
        ],
        columns: DEFAULT_COLUMNS,
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockState));
      
      const result = persistence.load();
      
      expect(result).toEqual(mockState);
    });

    it('should add default columns if missing', () => {
      const stateWithoutColumns = {
        tasks: [],
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(stateWithoutColumns));
      
      const result = persistence.load();
      
      expect(result?.columns).toEqual(DEFAULT_COLUMNS);
    });

    it('should return null and log error on invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = persistence.load();
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('save', () => {
    it('should save state to localStorage', () => {
      const state: BoardState = {
        tasks: [],
        columns: DEFAULT_COLUMNS,
      };
      
      persistence.save(state);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'kanban-board-state',
        JSON.stringify(state)
      );
    });

    it('should log error on save failure', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      persistence.save({ tasks: [], columns: DEFAULT_COLUMNS });
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should remove item from localStorage', () => {
      persistence.clear();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('kanban-board-state');
    });

    it('should log error on clear failure', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Access denied');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      persistence.clear();
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
