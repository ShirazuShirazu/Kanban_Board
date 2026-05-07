'use client';

import { useKanbanBoard } from './hooks/useKanbanBoard';
import { useDarkMode } from './hooks/useDarkMode';
import { KanbanBoard } from './components/KanbanBoard';
import { DarkModeToggle } from './components/DarkModeToggle';

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
    addColumn,
    updateColumn,
    deleteColumn,
  } = useKanbanBoard();

  const { isDark, toggleTheme, mounted } = useDarkMode();

  // Prevent hydration mismatch
  if (!isLoaded || !mounted) {
    return (
      <div className="loading-container">
        <div>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Kanban Board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="header-title">
              <h1>Kanban Board</h1>
              <p>Manage your tasks efficiently</p>
            </div>
          </div>

          <div className="header-right">
            <div className="task-count">
              <span>{tasks.length}</span> tasks total
            </div>
            {tasks.length > 0 && (
              <button onClick={clearBoard} className="btn btn-danger">
                Clear All
              </button>
            )}
            <DarkModeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content-inner">
          <KanbanBoard
            tasks={tasks}
            columns={columns}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
            onReorderTask={reorderTask}
            onAddColumn={addColumn}
            onUpdateColumn={updateColumn}
            onDeleteColumn={deleteColumn}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Interactive Kanban Task Board • Drag and drop to organize</p>
      </footer>
    </div>
  );
}
