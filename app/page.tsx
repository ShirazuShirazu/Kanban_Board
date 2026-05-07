'use client';

import { useKanbanBoard } from './hooks/useKanbanBoard';
import { KanbanBoard } from './components/KanbanBoard';

export default function Home() {
  const {
    tasks,
    columns,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    clearBoard,
  } = useKanbanBoard();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Kanban Board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Kanban Board
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your tasks efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{tasks.length}</span> tasks total
              </div>
              {tasks.length > 0 && (
                <button
                  onClick={clearBoard}
                  className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="h-full max-w-full mx-auto">
          <KanbanBoard
            tasks={tasks}
            columns={columns}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
            onReorderTask={reorderTask}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          Interactive Kanban Task Board • Drag and drop to organize
        </p>
      </footer>
    </div>
  );
}
