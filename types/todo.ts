export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm (optional)
  category?: string;
  tags?: string[];
  createdAt: number;
  completedAt?: number;
}

export type ThemeId =
  | 'royal-obsidian'
  | 'forest-green'
  | 'ocean-blue'
  | 'peach-cream'
  | 'classic-light';

export type AccentColor =
  | 'titanium'
  | 'emerald'
  | 'azure'
  | 'amber'
  | 'rose'
  | 'violet';

export type WallpaperPresetId =
  | 'dark-mountains'
  | 'midnight-gradient'
  | 'forest-mist'
  | 'ocean-depth'
  | 'peach-sunrise'
  | 'minimal-graphite';

export type WallpaperMode = 'preset' | 'custom' | 'none';

export type FilterStatus = 'all' | 'active' | 'completed' | 'today' | 'overdue';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'due-date'
  | 'priority'
  | 'alphabetical';

export type LayoutDensity = 'comfortable' | 'compact';
export type ClockFormat = '12h' | '24h';

export interface UserSettings {
  theme: ThemeId;
  accentColor: AccentColor;
  wallpaperMode: WallpaperMode;
  wallpaperPreset: WallpaperPresetId;
  wallpaperBlur: number; // 0 to 24px
  wallpaperDim: number; // 0 to 90%
  cardGlassOpacity: number; // 40 to 100%
  layoutDensity: LayoutDensity;
  showStats: boolean;
  showGreeting: boolean;
  clockFormat: ClockFormat;
  userName: string;
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export interface BackupData {
  version: number;
  appName: 'RoxTasks';
  exportedAt: string;
  tasks: Task[];
  settings: Partial<UserSettings>;
}
