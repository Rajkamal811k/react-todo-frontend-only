import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MindfulStats from './components/MindfulStats';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import BreatheModal from './components/BreatheModal';
import Toast from './components/Toast';
import { Search, Filter, Sparkles, Trash, RotateCcw, CheckCheck } from 'lucide-react';
import { natureAudio } from './utils/audio';
import { fireBotanicalConfetti } from './utils/confetti';
import './App.css';

const DEFAULT_TASKS = [
  {
    id: 'seed-1',
    text: '🍵 Prepare warm herbal tea and set a calm daily intention',
    category: 'mindful',
    priority: 'low',
    dueTime: '08:30',
    completed: true,
    pinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    text: '🌿 Water the house plants and open the window for morning air',
    category: 'wellness',
    priority: 'medium',
    dueTime: '09:15',
    completed: false,
    pinned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    text: '✨ Focused deep work session without multitasking or rushing',
    category: 'work',
    priority: 'high',
    dueTime: '11:00',
    completed: false,
    pinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-4',
    text: '🚶 Take a quiet 20-minute walk through nature or trees',
    category: 'wellness',
    priority: 'medium',
    dueTime: '16:30',
    completed: false,
    pinned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-5',
    text: '📖 Savor 15 pages of soothing reading before rest',
    category: 'mindful',
    priority: 'low',
    dueTime: '21:00',
    completed: false,
    pinned: false,
    createdAt: new Date().toISOString(),
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Realms' },
  { id: 'mindful', label: '🌱 Mindful' },
  { id: 'work', label: '💼 Work' },
  { id: 'wellness', label: '🌿 Wellness' },
  { id: 'home', label: '🏡 Living' },
  { id: 'creative', label: '✨ Creative' },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('sylvan_tasks_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_TASKS;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sylvan_theme_v2') || 'mist';
  });

  const [isMuted, setIsMuted] = useState(false);
  const [filterTab, setFilterTab] = useState('all'); // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBreatheOpen, setIsBreatheOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sylvan_theme_v2', theme);
  }, [theme]);

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem('sylvan_tasks_v2', JSON.stringify(tasks));
    } catch {
      // LocalStorage handle
    }
  }, [tasks]);

  const showToast = (message, undoAction = null) => {
    setToast({ message, undoAction });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast('New intention planted in your garden 🌱');
  };

  const handleToggleComplete = (id) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      const willBeCompleted = !target?.completed;

      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: willBeCompleted } : t
      );

      // Check if all are now completed
      const remainingUnfinished = updated.filter((t) => !t.completed).length;
      if (willBeCompleted && remainingUnfinished === 0 && updated.length > 0) {
        natureAudio.playZenCelebration();
        fireBotanicalConfetti();
        showToast('🌸 Every intention has blossomed today in full peace!');
      } else if (willBeCompleted) {
        fireBotanicalConfetti();
      }

      return updated;
    });
  };

  const handleTogglePin = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    );
  };

  const handleUpdateText = (id, newText) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
    showToast('Intention quietly refined ✨');
  };

  const handleDeleteTask = (taskToDelete) => {
    setLastDeletedTask(taskToDelete);
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    showToast(`Released "${taskToDelete.text.slice(0, 24)}..."`, () => {
      setTasks((prev) => [taskToDelete, ...prev]);
      showToast('Intention restored 🌱');
    });
  };

  const handleDuplicateTask = (task) => {
    const dup = {
      ...task,
      id: Date.now().toString(),
      text: `${task.text} (Copy)`,
      completed: false,
    };
    setTasks((prev) => [dup, ...prev]);
    showToast('Intention cloned gently 🌿');
  };

  const handleClearCompleted = () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    natureAudio.playWoodClick();
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(`Archived ${completedTasks.length} blossomed intentions`, () => {
      setTasks((prev) => [...prev, ...completedTasks]);
    });
  };

  const handleResetDefaults = () => {
    natureAudio.playWoodClick();
    setTasks(DEFAULT_TASKS);
    showToast('Sample garden restored 🌸');
  };

  // Filtering and Sorting
  const filteredTasks = tasks.filter((task) => {
    // Status tab filter
    if (filterTab === 'active' && task.completed) return false;
    if (filterTab === 'completed' && !task.completed) return false;

    // Realm category filter
    if (categoryFilter !== 'all' && task.category !== categoryFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = task.text.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      if (!matchText && !matchCat) return false;
    }

    return true;
  });

  // Sort pinned items to the top, then by active status
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="sylvan-app-container">
      {/* Background Zen Leaves decoration */}
      <div className="natural-leaf-accent top-right" aria-hidden="true" />
      <div className="natural-leaf-accent bottom-left" aria-hidden="true" />

      {/* Main Container */}
      <div className="sylvan-main-wrapper">
        <Header
          theme={theme}
          setTheme={setTheme}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onOpenBreathe={() => setIsBreatheOpen(true)}
        />

        <main className="sylvan-content-area">
          {/* Daily Progress & Cultivation Stats */}
          <MindfulStats tasks={tasks} />

          {/* Plant a Task Input */}
          <TaskInput onAddTask={handleAddTask} />

          {/* Filter, Search & Status Strip */}
          <div className="controls-island">
            {/* Status Tabs */}
            <div className="filter-tab-bar">
              <button
                type="button"
                className={`tab-btn ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => {
                  natureAudio.playWoodClick();
                  setFilterTab('all');
                }}
              >
                All Seeds ({tasks.length})
              </button>
              <button
                type="button"
                className={`tab-btn ${filterTab === 'active' ? 'active' : ''}`}
                onClick={() => {
                  natureAudio.playWoodClick();
                  setFilterTab('active');
                }}
              >
                Growing ({tasks.filter((t) => !t.completed).length})
              </button>
              <button
                type="button"
                className={`tab-btn ${filterTab === 'completed' ? 'active' : ''}`}
                onClick={() => {
                  natureAudio.playWoodClick();
                  setFilterTab('completed');
                }}
              >
                Blossomed ({completedCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="search-box-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search intentions..."
                className="search-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Pills Slider */}
          <div className="realm-filter-scroller">
            <span className="scroller-label">Realm:</span>
            {CATEGORY_TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={`category-chip ${
                  categoryFilter === tab.id ? 'active' : ''
                }`}
                onClick={() => {
                  natureAudio.playWoodClick();
                  setCategoryFilter(tab.id);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tasks Container */}
          <div className="tasks-flow-container">
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onTogglePin={handleTogglePin}
                  onUpdateText={handleUpdateText}
                  onDelete={handleDeleteTask}
                  onDuplicate={handleDuplicateTask}
                />
              ))
            ) : (
              <div className="empty-garden-state">
                <div className="empty-icon-circle">🌱</div>
                <h3 className="empty-title">
                  {searchQuery || categoryFilter !== 'all'
                    ? 'No matching intentions found'
                    : filterTab === 'completed'
                    ? 'No blossomed intentions yet'
                    : 'Your garden is serene and waiting'}
                </h3>
                <p className="empty-desc">
                  {searchQuery || categoryFilter !== 'all'
                    ? 'Try clearing your realm filters or search query.'
                    : 'Plant a mindful task above to nurture your day with quiet purpose.'}
                </p>
                {(searchQuery || categoryFilter !== 'all') && (
                  <button
                    type="button"
                    className="empty-action-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    }}
                  >
                    Reset Realm Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Toolbar */}
          <div className="garden-footer-toolbar">
            <div className="garden-tip">
              <span>🍃</span>
              <span>Take one mindful breath before each intention.</span>
            </div>

            <div className="footer-actions">
              {completedCount > 0 && (
                <button
                  type="button"
                  className="footer-btn"
                  onClick={handleClearCompleted}
                  title="Archive blossomed intentions"
                >
                  <CheckCheck size={14} />
                  <span>Clear Blossomed</span>
                </button>
              )}

              <button
                type="button"
                className="footer-btn text-only"
                onClick={handleResetDefaults}
                title="Restore default sample intentions"
              >
                <RotateCcw size={13} />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Breathe Mindfulness Modal */}
      <BreatheModal
        isOpen={isBreatheOpen}
        onClose={() => setIsBreatheOpen(false)}
      />

      {/* Organic Notification Toast */}
      <Toast
        toast={toast}
        onUndo={() => {
          if (toast?.undoAction) toast.undoAction();
          setToast(null);
        }}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
