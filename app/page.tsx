'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Task,
  UserSettings,
  FilterStatus,
  SortOption,
  ToastNotification,
} from '@/types/todo';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  exportBackup,
  parseAndValidateBackup,
  DEFAULT_SETTINGS,
} from '@/lib/storage';
import {
  getCustomWallpaper,
  saveCustomWallpaper,
  deleteCustomWallpaper,
} from '@/lib/indexeddb';
import { THEMES } from '@/lib/themes';
import { WallpaperBackground } from '@/components/WallpaperBackground';
import { AppHeader } from '@/components/AppHeader';
import { GreetingBanner } from '@/components/GreetingBanner';
import { DashboardStats } from '@/components/DashboardStats';
import { TaskInput } from '@/components/TaskInput';
import { FilterBar } from '@/components/FilterBar';
import { TaskList } from '@/components/TaskList';
import { TaskEditorModal } from '@/components/TaskEditorModal';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ToastContainer } from '@/components/ToastContainer';

export default function RoxTasksPage() {
  // 1. Core State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Custom Wallpaper State (IndexedDB)
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(null);
  const [customWallpaperFileName, setCustomWallpaperFileName] = useState<string | null>(null);

  // Filter & Search State
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Confirm Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    action?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Refs
  const taskInputRef = useRef<HTMLInputElement>(null);

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

  // 2. Load Initial Data on Mount
  useEffect(() => {
    Promise.all([
      Promise.resolve().then(() => ({
        settings: loadSettingsFromStorage(),
        tasks: loadTasksFromStorage(),
      })),
      getCustomWallpaper(),
    ]).then(([localData, wp]) => {
      setSettings(localData.settings);
      setTasks(localData.tasks);

      // Apply or remove dark class on HTML root element for Tailwind v4 custom-variant dark
      const themeObj = THEMES[localData.settings.theme] || THEMES['royal-obsidian'];
      if (themeObj.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (wp) {
        setCustomWallpaperUrl(wp.objectUrl);
        setCustomWallpaperFileName(wp.fileName);
      }
      setIsLoaded(true);
    });
  }, []);

  // Update HTML dark class whenever theme changes
  useEffect(() => {
    if (!isLoaded) return;
    const themeObj = THEMES[settings.theme] || THEMES['royal-obsidian'];
    if (themeObj.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme, isLoaded]);

  // 3. Persist State Changes
  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveSettingsToStorage(updated);
        return updated;
      });
    },
    []
  );

  const persistTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasksToStorage(newTasks);
  }, []);

  // 4. Task Mutations
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const task: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: Date.now(),
    };

    const nextTasks = [task, ...tasks];
    persistTasks(nextTasks);
    showToast('Task created successfully', 'success');
  };

  const handleToggleStatus = (taskId: string) => {
    const nextTasks = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const isNowCompleted = t.status !== 'completed';
      return {
        ...t,
        status: (isNowCompleted ? 'completed' : 'active') as Task['status'],
        completedAt: isNowCompleted ? Date.now() : undefined,
      };
    });

    persistTasks(nextTasks);
    const target = tasks.find((t) => t.id === taskId);
    if (target?.status === 'active') {
      showToast('Task completed! Keep the momentum.', 'success');
    }
  };

  const handleSaveEditedTask = (updatedTask: Task) => {
    const nextTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    persistTasks(nextTasks);
    setEditingTask(null);
    showToast('Task updated', 'info');
  };

  const handleDeleteTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    setConfirmModalConfig({
      isOpen: true,
      title: 'Delete Task?',
      message: `Are you sure you want to delete "${target?.title || 'this task'}"? This action cannot be undone.`,
      confirmLabel: 'Delete Task',
      isDestructive: true,
      action: () => {
        const nextTasks = tasks.filter((t) => t.id !== taskId);
        persistTasks(nextTasks);
        showToast('Task deleted', 'info');
      },
    });
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.status === 'completed').length;
    if (completedCount === 0) return;

    setConfirmModalConfig({
      isOpen: true,
      title: 'Clear Completed Tasks?',
      message: `You are about to remove ${completedCount} completed task${completedCount === 1 ? '' : 's'}. Are you sure?`,
      confirmLabel: 'Clear All Completed',
      isDestructive: true,
      action: () => {
        const nextTasks = tasks.filter((t) => t.status !== 'completed');
        persistTasks(nextTasks);
        showToast(`Cleared ${completedCount} completed tasks`, 'info');
      },
    });
  };

  const handleClearAllTasks = () => {
    if (tasks.length === 0) return;

    setConfirmModalConfig({
      isOpen: true,
      title: 'Clear All Tasks?',
      message: 'This will permanently remove all tasks from your local storage. Make sure you have exported a backup if needed.',
      confirmLabel: 'Delete Everything',
      isDestructive: true,
      action: () => {
        persistTasks([]);
        setIsSettingsOpen(false);
        showToast('All tasks cleared', 'warning');
      },
    });
  };

  // 5. Wallpaper Upload & Storage
  const handleUploadWallpaper = async (file: File) => {
    const url = await saveCustomWallpaper(file);
    setCustomWallpaperUrl(url);
    setCustomWallpaperFileName(file.name);
    showToast('Custom wallpaper saved to local storage', 'success');
  };

  const handleRemoveCustomWallpaper = async () => {
    await deleteCustomWallpaper();
    setCustomWallpaperUrl(null);
    setCustomWallpaperFileName(null);
    updateSettings({ wallpaperMode: 'preset', wallpaperPreset: 'midnight-gradient' });
    showToast('Custom wallpaper removed. Restored preset wallpaper.', 'info');
  };

  // 6. Reset Appearance
  const handleResetAppearance = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Reset Appearance?',
      message: 'This will restore theme, colors, and wallpaper to default settings. Your saved tasks will NOT be modified.',
      confirmLabel: 'Reset Styles',
      isDestructive: false,
      action: () => {
        updateSettings({
          theme: DEFAULT_SETTINGS.theme,
          accentColor: DEFAULT_SETTINGS.accentColor,
          wallpaperMode: DEFAULT_SETTINGS.wallpaperMode,
          wallpaperPreset: DEFAULT_SETTINGS.wallpaperPreset,
          wallpaperBlur: DEFAULT_SETTINGS.wallpaperBlur,
          wallpaperDim: DEFAULT_SETTINGS.wallpaperDim,
          cardGlassOpacity: DEFAULT_SETTINGS.cardGlassOpacity,
          layoutDensity: DEFAULT_SETTINGS.layoutDensity,
        });
        showToast('Appearance reset to default', 'info');
      },
    });
  };

  // 7. Backup Export & Import
  const handleExportBackup = () => {
    exportBackup(tasks, settings);
    showToast('Backup downloaded successfully (.JSON)', 'success');
  };

  const handleImportBackupFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;

      const result = parseAndValidateBackup(text);
      if (!result.success || !result.tasks) {
        showToast(result.error || 'Failed to read backup file', 'error');
        return;
      }

      setConfirmModalConfig({
        isOpen: true,
        title: 'Restore Backup?',
        message: `Found ${result.tasks.length} valid tasks in this backup. Do you want to load these tasks into RoxTasks?`,
        confirmLabel: 'Restore Backup',
        isDestructive: false,
        action: () => {
          persistTasks(result.tasks!);
          if (result.settings) {
            updateSettings(result.settings);
          }
          setIsSettingsOpen(false);
          showToast(`Successfully restored ${result.tasks!.length} tasks!`, 'success');
        },
      });
    };
    reader.readAsText(file);
  };

  // 8. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus new task input on Ctrl+N or Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        taskInputRef.current?.focus();
      }
      // Close open modals on Escape
      if (e.key === 'Escape') {
        if (editingTask) setEditingTask(null);
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (confirmModalConfig.isOpen) setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingTask, isSettingsOpen, confirmModalConfig.isOpen]);

  // 9. Filtered & Sorted Tasks Computation
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    const todayStr = new Date().toISOString().split('T')[0];

    // Status Filter
    if (filter === 'active') {
      result = result.filter((t) => t.status === 'active');
    } else if (filter === 'completed') {
      result = result.filter((t) => t.status === 'completed');
    } else if (filter === 'today') {
      result = result.filter((t) => t.status === 'active' && t.dueDate === todayStr);
    } else if (filter === 'overdue') {
      result = result.filter((t) => t.status === 'active' && t.dueDate && t.dueDate < todayStr);
    }

    // Search Query (title, description, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(q);
        const descMatch = t.description?.toLowerCase().includes(q);
        const tagMatch = t.category?.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q));
        return titleMatch || descMatch || tagMatch;
      });
    }

    // Category / Tag filter
    if (selectedTag) {
      result = result.filter((t) => t.category === selectedTag || t.tags?.includes(selectedTag.toLowerCase()));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') {
        const weight: Record<Task['priority'], number> = { high: 3, medium: 2, low: 1 };
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
  }, [tasks, filter, searchQuery, selectedTag, sortBy]);

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 animate-pulse flex items-center justify-center text-white font-bold">
            Rx
          </div>
          <span className="text-xs font-mono tracking-wider">Loading RoxTasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500/30">
      {/* 1. Dynamic Wallpaper Background */}
      <WallpaperBackground
        settings={settings}
        customWallpaperUrl={customWallpaperUrl}
      />

      {/* 2. Top Header Bar */}
      <AppHeader
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenQuickNewTask={() => taskInputRef.current?.focus()}
        onQuickBackup={handleExportBackup}
      />

      {/* 3. Main Dashboard Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Greeting Banner */}
        <GreetingBanner
          settings={settings}
          tasks={tasks}
          onUpdateUserName={(name) => updateSettings({ userName: name })}
        />

        {/* Dashboard Statistics Overview */}
        <DashboardStats
          tasks={tasks}
          settings={settings}
        />

        {/* Task Creation Bar */}
        <TaskInput
          settings={settings}
          onAddTask={handleAddTask}
          inputRef={taskInputRef}
        />

        {/* Filter, Search & Sorting Bar */}
        <FilterBar
          settings={settings}
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          onClearCompleted={handleClearCompleted}
        />

        {/* Main Task List */}
        <TaskList
          tasks={tasks}
          filteredTasks={filteredTasks}
          settings={settings}
          filter={filter}
          searchQuery={searchQuery}
          onToggleStatus={handleToggleStatus}
          onEdit={(task) => setEditingTask(task)}
          onDelete={handleDeleteTask}
          onOpenNewTask={() => taskInputRef.current?.focus()}
        />
      </main>

      {/* 4. Understated Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">RoxTasks</span>
            <span aria-hidden="true">·</span>
            <span>Your Tasks. Your Rules. Your Style.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Local-First & Offline Ready</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span className="text-slate-300 font-medium">Crafted by Build Rox</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals & Drawers */}
      <TaskEditorModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        settings={settings}
        onSave={handleSaveEditedTask}
        onClose={() => setEditingTask(null)}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        settings={settings}
        customWallpaperUrl={customWallpaperUrl}
        customWallpaperFileName={customWallpaperFileName}
        onUpdateSettings={updateSettings}
        onUploadWallpaper={handleUploadWallpaper}
        onRemoveCustomWallpaper={handleRemoveCustomWallpaper}
        onResetAppearance={handleResetAppearance}
        onExportBackup={handleExportBackup}
        onImportBackupFile={handleImportBackupFile}
        onClearAllTasks={handleClearAllTasks}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        isDestructive={confirmModalConfig.isDestructive}
        settings={settings}
        onConfirm={() => {
          confirmModalConfig.action?.();
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
