export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  createdAt: number;
  completedAt?: number;
}

export type ThemeId =
  | 'minimal-light'
  | 'royal-obsidian'
  | 'forest-green'
  | 'ocean-blue'
  | 'peach-cream';

export type WallpaperPresetId =
  | 'minimal-white'
  | 'dark-graphite'
  | 'forest-mist'
  | 'ocean-gradient'
  | 'peach-sunrise';

export type ViewMode = 'board' | 'list';

export type NavFilter = 'all' | 'today' | 'upcoming' | 'completed';

export type SortOption = 'newest' | 'oldest' | 'due-date' | 'priority';

export interface UserSettings {
  theme: ThemeId;
  accentColor: string;
  wallpaperMode: 'preset' | 'custom' | 'none';
  wallpaperPreset: WallpaperPresetId;
  wallpaperBlur: number; // 0 to 24px
  wallpaperDim: number; // 0 to 80%
  cardOpacity: number; // 50 to 100%
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}
