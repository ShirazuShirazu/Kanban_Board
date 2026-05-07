# Interactive Kanban Task Board

A fully-featured Kanban-style task management application built with Next.js, React, and TypeScript. This application allows users to create, organize, and manage tasks across multiple workflow columns with drag-and-drop functionality.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Framework & Library Choices](#framework--library-choices)
- [Component Architecture](#component-architecture)
- [State Management Approach](#state-management-approach)
- [Features](#features)
- [Assumptions Made](#assumptions-made)
- [Known Limitations](#known-limitations)
- [Unit Tests](#unit-tests)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone or extract the project:
```bash
cd kanban-project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
kanban-project/
├── app/
│   ├── __tests__/              # Unit tests
│   │   └── persistence.test.ts
│   ├── components/             # React components
│   │   ├── ColumnModal.tsx     # Add/Edit column modal
│   │   ├── ConfirmModal.tsx    # Confirmation dialog
│   │   ├── DarkModeToggle.tsx  # Theme toggle button
│   │   ├── FilterBar.tsx       # Search & filter UI
│   │   ├── KanbanBoard.tsx     # Main board component
│   │   ├── KanbanColumn.tsx    # Column component
│   │   ├── TaskCard.tsx        # Individual task card
│   │   └── TaskModal.tsx       # Add/Edit task modal
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDarkMode.ts      # Dark mode state management
│   │   ├── useKanbanBoard.ts   # Main board state hook
│   │   └── useTaskFilter.ts    # Filtering logic hook
│   ├── lib/                    # Utility libraries
│   │   └── persistence.ts      # localStorage abstraction
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts            # Core type definitions
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
├── public/                     # Static assets
├── next.config.ts              # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Framework & Library Choices

### Next.js 16.2.5
**Reasoning:** Next.js provides a robust React framework with excellent TypeScript support, server-side rendering capabilities, and a great developer experience. The App Router architecture allows for better performance and modern React patterns.

### React 19.2.4
**Reasoning:** React is the industry standard for building interactive UIs. Using the latest stable version ensures access to modern features and improvements.

### TypeScript
**Reasoning:** TypeScript provides static type checking, better IDE support, and improved code maintainability. Essential for a project of this complexity with many interrelated data structures.

### @dnd-kit (Drag and Drop)
**Reasoning:** 
- **dnd-kit/core** - Provides the foundational drag-and-drop primitives
- **dnd-kit/sortable** - Enables sorting functionality within and between columns
- **dnd-kit/utilities** - Utility functions for drag operations

Chosen over react-beautiful-dnd because:
- Better TypeScript support
- More flexible and modern API
- Actively maintained
- Better performance characteristics
- Support for modern React patterns

### Custom CSS (No Tailwind)
**Reasoning:** 
- Complete control over styling
- Smaller bundle size for this specific use case
- Easier to implement complex dark mode theming with CSS variables
- Better performance without runtime CSS generation
- Clear separation of concerns

## Component Architecture

### Container/Presentation Pattern

**Container Components:**
- `page.tsx` - Main page, orchestrates hooks and passes data
- `KanbanBoard.tsx` - Main board container, manages drag-and-drop and modals

**Presentation Components:**
- `KanbanColumn.tsx` - Displays a single column with its tasks
- `TaskCard.tsx` - Displays individual task information
- `TaskModal.tsx` - Form for creating/editing tasks
- `ColumnModal.tsx` - Form for creating/editing columns
- `FilterBar.tsx` - Search and filter controls
- `ConfirmModal.tsx` - Reusable confirmation dialog
- `DarkModeToggle.tsx` - Theme toggle button

### Component Hierarchy

```
Page (Home)
├── Header (title, task count, dark mode toggle)
├── KanbanBoard
│   ├── FilterBar (search, priority filter)
│   ├── DndContext
│   │   └── Board Columns
│   │       ├── KanbanColumn[]
│   │       │   └── TaskCard[]
│   │       └── Add Column Button
│   └── Modals
│       ├── TaskModal
│       ├── ColumnModal
│       └── ConfirmModal
└── Footer
```

## State Management Approach

### Custom Hooks Architecture

State is managed through three primary custom hooks:

### 1. useKanbanBoard
**Location:** `app/hooks/useKanbanBoard.ts`

Manages the core board state including:
- Tasks array
- Columns array
- CRUD operations for tasks and columns
- Task movement between columns
- Task reordering within columns
- Persistence integration

**Key Functions:**
- `addTask()` - Creates new task with generated ID and timestamp
- `updateTask()` - Updates existing task properties
- `deleteTask()` - Removes task by ID
- `moveTask()` - Moves task to different column
- `reorderTask()` - Reorders tasks within a column
- `addColumn()` - Creates new column
- `updateColumn()` - Renames column
- `deleteColumn()` - Removes column (moves tasks to first column)

### 2. useTaskFilter
**Location:** `app/hooks/useTaskFilter.ts`

Manages filtering and search state:
- Search query state
- Priority filter state
- Filtered task computation (memoized)
- Search submission with loading state

**Features:**
- Client-side search by title/description
- Priority filtering (Low, Medium, High, Urgent, All)
- Combined filter logic (intersection)
- Simulated async search with spinner

### 3. useDarkMode
**Location:** `app/hooks/useDarkMode.ts`

Manages theme state:
- Light/dark mode toggle
- localStorage persistence
- System preference detection
- CSS class application

### Persistence Layer

**Location:** `app/lib/persistence.ts`

Abstracted persistence layer using localStorage:
```typescript
interface PersistenceLayer {
  load(): BoardState | null;
  save(state: BoardState): void;
  clear(): void;
}
```

**Benefits:**
- Can be easily swapped for API backend
- Error handling for storage failures
- Data migration support
- SSR-safe (checks for window object)

## Features

### Core Features
1. **Multi-column Board** - Default columns: To Do, In Progress, In Review, Done
2. **Task Management** - Create, read, update, delete tasks
3. **Drag & Drop** - Move tasks between columns and reorder within columns
4. **Search & Filter** - Search by title/description, filter by priority
5. **Dark Mode** - Toggle between light and dark themes
6. **Column Management** - Add, edit, delete custom columns
7. **Confirmation Dialogs** - Prevent accidental deletions

### Task Properties
- Title (required, 3-100 chars)
- Description (required, 10-500 chars)
- Priority (Low, Medium, High, Urgent) with color coding
- Assignee (required, 2-50 chars)
- Creation timestamp
- Column assignment

### UI/UX Features
- Responsive layout
- Visual drag feedback
- Loading spinners
- Form validation
- Expandable task descriptions
- Priority badges
- Task counts per column

## Assumptions Made

1. **Single User** - No user authentication or multi-user support
2. **Client-Side Only** - All data stored in browser localStorage
3. **No Backend** - Persistence layer abstracted but currently only implements localStorage
4. **Desktop-First** - Optimized for desktop/tablet; mobile has limited drag-and-drop support
5. **No Real-Time Sync** - Changes not synchronized across browser tabs
6. **English Language** - UI and content in English only
7. **Modern Browsers** - Requires browsers supporting CSS Grid, Flexbox, and modern JavaScript
8. **Unique IDs** - Using timestamp + random string for ID generation (not UUID)
9. **No Undo** - No undo/redo functionality implemented
10. **Column Limit** - Must maintain at least one column at all times

## Known Limitations

1. **Persistence** - Data stored in localStorage only, cleared if user clears browser data
2. **No Offline Support** - Requires internet connection to load (Next.js requirement)
3. **No Export/Import** - Cannot backup or restore board data
4. **Limited Mobile Support** - Drag-and-drop less optimal on touch devices
5. **No Keyboard Shortcuts** - All interactions require mouse/touch
6. **No Undo** - Accidental deletions are permanent
7. **Single Board** - Cannot create multiple boards
8. **No Task History** - No tracking of task changes over time
9. **No Due Dates** - Tasks don't have deadline functionality
10. **No Attachments** - Cannot attach files or images to tasks
11. **No Comments** - No discussion/comment system on tasks
12. **Column Order** - Cannot reorder columns via drag-and-drop

## Unit Tests

### Test Coverage

**Location:** `app/__tests__/persistence.test.ts`

Tests for the persistence layer:
- Loading from localStorage
- Saving to localStorage
- Handling missing data
- Error handling for invalid JSON
- Migration support (adding default columns)
- Clear functionality

### Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Configuration

Tests use:
- **Vitest** - Modern test runner
- **@testing-library/react** - React component testing
- **jsdom** - Browser environment simulation
- **vi** - Mocking utilities

## Development Decisions

### Why Custom CSS Over Tailwind?

While Tailwind is excellent for rapid prototyping, custom CSS was chosen for:
- Better performance (no runtime CSS generation)
- Easier dark mode implementation with CSS variables
- More explicit styling (easier to maintain)
- Smaller bundle size

### Why Custom Hooks Over Redux/Context?

For this application size:
- Custom hooks provide sufficient state management
- Less boilerplate than Redux
- No prop drilling issues with component structure
- Easier to test and understand

### Why @dnd-kit Over react-beautiful-dnd?

- Modern, actively maintained
- Better TypeScript support
- More flexible API
- Better performance
- Smaller bundle size

## License

MIT License - Feel free to use this project for educational or commercial purposes.

## Author

Created as part of a Software Engineer II (Frontend) assessment.

---

**Last Updated:** May 2026
**Version:** 1.0.0
