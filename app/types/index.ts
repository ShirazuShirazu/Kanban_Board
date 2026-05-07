export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  createdAt: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
}

export interface BoardState {
  tasks: Task[];
  columns: Column[];
}

export interface FilterState {
  searchQuery: string;
  priorityFilter: Priority | 'All';
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: 'border-l-blue-400 bg-blue-50',
  Medium: 'border-l-yellow-400 bg-yellow-50',
  High: 'border-l-orange-400 bg-orange-50',
  Urgent: 'border-l-red-500 bg-red-50',
};

export const PRIORITY_BADGE_COLORS: Record<Priority, string> = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Urgent: 'bg-red-100 text-red-800',
};

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'in-review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];
