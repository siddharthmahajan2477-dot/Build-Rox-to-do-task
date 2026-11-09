'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  TaskStatus,
  UserSettings,
  ViewMode,
  NavFilter,
  SortOption,
  ToastNotification,
} from '@/types/todo';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  DEFAULT_SETTINGS,
} from '@/lib/storage';
import {
  getCustomWallpaper,
  saveCustomWallpaper,
  deleteCustomWallpaper,
} from '@/lib/indexeddb';
import { THEMES } from '@/lib/themes';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { BoardView } from '@/components/BoardView';
import { ListView } from '@/components/ListView';
import { TaskModal } from '@/components/TaskModal';
import { SettingsPanel } from '@/components/SettingsPanel';
import { WallpaperBackground } from '@/components/WallpaperBackground';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ToastContainer } from '@/components/ToastContainer';

export default function RoxTasksPage() {
  // 1. Core State (Empty by default on first launch!)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom Wallpaper (IndexedDB)
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(null);

  // Active View & Filters
  const [activeNav, setActiveNav] = useState<NavFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modals & Panels
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [taskModalConfig, setTaskModalConfig] = useState<{
    isOpen: boolean;
    task: Task | null;
    defaultStatus: TaskStatus;
  }>({
    isOpen: false,
    task: null,
    defaultStatus: 'todo',
  });

  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastNotification['type'] = 'info') => {
      const id = String(Date.now() + Math.random());
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Load stored state asynchronously on mount
  useEffect(() => {
    Promise.all([
      Promise.resolve().then(() => ({
        tasks: loadTasksFromStorage(),
        settings: loadSettingsFromStorage(),
      })),
      getCustomWallpaper(),
    ]).then(([localData, wp]) => {
      setTasks(localData.tasks);
      setSettings(localData.settings);

      const themeObj = THEMES[localData.settings.theme] || THEMES['minimal-light'];
      if (themeObj.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (wp) {
        setCustomWallpaperUrl(wp.objectUrl);
      }
      setIsLoaded(true);
    });
  }, []);

  // Update HTML class on theme change
  useEffect(() => {
    if (!isLoaded) return;
    const themeObj = THEMES[settings.theme] || THEMES['minimal-light'];
    if (themeObj.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme, isLoaded]);

  // 3. State persistence helpers
  const persistTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasksToStorage(newTasks);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToStorage(updated);
      return updated;
    });
  }, []);

  // 4. Task Mutations
  const handleOpenCreateTask = (defaultStatus: TaskStatus = 'todo') => {
    setTaskModalConfig({
      isOpen: true,
      task: null,
      defaultStatus,
    });
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskModalConfig({
      isOpen: true,
      task,
      defaultStatus: task.status,
    });
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => {
    if (taskData.id) {
      // Editing existing task
      const nextTasks = tasks.map((t) => {
        if (t.id !== taskData.id) return t;
        return {
          ...t,
          ...taskData,
        };
      });
      persistTasks(nextTasks);
      showToast('Task updated', 'info');
    } else {
      // Creating new task
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      const nextTasks = [newTask, ...tasks];
      persistTasks(nextTasks);
      showToast('Task created successfully', 'success');
    }
    setTaskModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    setConfirmModalConfig({
      isOpen: true,
      title: 'Delete Task?',
      message: `Are you sure you want to delete "${target?.title || 'this task'}"?`,
      action: () => {
        const nextTasks = tasks.filter((t) => t.id !== taskId);
        persistTasks(nextTasks);
        showToast('Task deleted', 'info');
      },
    });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const nextTasks = tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        status: newStatus,
        completedAt: newStatus === 'completed' ? (t.completedAt || Date.now()) : undefined,
      };
    });
    persistTasks(nextTasks);
    if (newStatus === 'completed') {
      showToast('Task marked as completed', 'success');
    }
  };

  // 5. Wallpaper & Appearance
  const handleUploadWallpaper = async (file: File) => {
    const url = await saveCustomWallpaper(file);
    setCustomWallpaperUrl(url);
    showToast('Custom wallpaper saved locally', 'success');
  };

  const handleRemoveCustomWallpaper = async () => {
    await deleteCustomWallpaper();
    setCustomWallpaperUrl(null);
    updateSettings({ wallpaperMode: 'preset', wallpaperPreset: 'minimal-white' });
    showToast('Custom wallpaper removed', 'info');
  };

  const handleResetAppearance = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Reset Appearance?',
      message: 'Restore all styling, themes, and wallpaper to default? Your tasks will NOT be modified.',
      action: () => {
        updateSettings({
          theme: DEFAULT_SETTINGS.theme,
          accentColor: DEFAULT_SETTINGS.accentColor,
          wallpaperMode: DEFAULT_SETTINGS.wallpaperMode,
          wallpaperPreset: DEFAULT_SETTINGS.wallpaperPreset,
          wallpaperBlur: DEFAULT_SETTINGS.wallpaperBlur,
          wallpaperDim: DEFAULT_SETTINGS.wallpaperDim,
          cardOpacity: DEFAULT_SETTINGS.cardOpacity,
        });
        showToast('Appearance reset to default', 'info');
      },
    });
  };

  // 6. Real task counts for sidebar summary
  const taskCounts = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return {
      all: tasks.length,
      today: tasks.filter((t) => t.dueDate === todayStr).length,
      upcoming: tasks.filter((t) => Boolean(t.dueDate && t.dueDate > todayStr)).length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    };
  }, [tasks]);

  // 7. Filtered & Sorted Tasks computation
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    const todayStr = new Date().toISOString().split('T')[0];

    // Sidebar filter
    if (activeNav === 'today') {
      result = result.filter((t) => t.dueDate === todayStr);
    } else if (activeNav === 'upcoming') {
      result = result.filter((t) => Boolean(t.dueDate && t.dueDate > todayStr));
    } else if (activeNav === 'completed') {
      result = result.filter((t) => t.status === 'completed');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'priority') {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      }
      if (sortBy === 'due-date') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });

    return result;
  }, [tasks, activeNav, searchQuery, sortBy]);

  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 font-medium text-xs">
        Loading RoxTasks...
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex relative transition-colors ${currentTheme.colors.bgPage} ${currentTheme.colors.textPrimary}`}>
      {/* Dynamic Wallpaper Layer */}
      <WallpaperBackground
        settings={settings}
        customWallpaperUrl={customWallpaperUrl}
      />

      {/* 1. Left Vertical Navigation Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        taskCounts={taskCounts}
        settings={settings}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header & Minimal Toolbar */}
        <TopBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onOpenNewTask={() => handleOpenCreateTask('todo')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          settings={settings}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-5 sm:p-6 max-w-7xl w-full mx-auto">
          {viewMode === 'board' ? (
            <BoardView
              tasks={filteredTasks}
              settings={settings}
              onEdit={handleOpenEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onAddTaskInColumn={handleOpenCreateTask}
            />
          ) : (
            <ListView
              tasks={filteredTasks}
              settings={settings}
              onEdit={handleOpenEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          )}
        </main>
      </div>

      {/* 3. Task Modal (Create & Edit) */}
      <TaskModal
        task={taskModalConfig.task}
        defaultStatus={taskModalConfig.defaultStatus}
        isOpen={taskModalConfig.isOpen}
        settings={settings}
        onSave={handleSaveTask}
        onClose={() => setTaskModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 4. Appearance Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        customWallpaperUrl={customWallpaperUrl}
        onUpdateSettings={updateSettings}
        onUploadWallpaper={handleUploadWallpaper}
        onRemoveCustomWallpaper={handleRemoveCustomWallpaper}
        onResetAppearance={handleResetAppearance}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* 5. Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        isDestructive
        settings={settings}
        onConfirm={() => {
          confirmModalConfig.action?.();
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 6. Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
