import { Task, UserSettings, BackupData } from '@/types/todo';

export const STORAGE_KEYS = {
  TASKS: 'roxtasks_tasks_v1',
  SETTINGS: 'roxtasks_settings_v1',
  INITIALIZED: 'roxtasks_initialized_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'royal-obsidian',
  accentColor: 'titanium',
  wallpaperMode: 'preset',
  wallpaperPreset: 'midnight-gradient',
  wallpaperBlur: 0,
  wallpaperDim: 20,
  cardGlassOpacity: 90,
  layoutDensity: 'comfortable',
  showStats: true,
  showGreeting: true,
  clockFormat: '12h',
  userName: 'Builder',
  soundEnabled: true,
  reducedMotion: false,
};

export const STARTER_TASKS: Task[] = [
  {
    id: 'starter-1',
    title: 'Welcome to RoxTasks — click the checkbox to complete this task',
    description: 'RoxTasks is your high-performance, private, local-first productivity dashboard. All your tasks stay in your browser.',
    priority: 'high',
    status: 'active',
    category: 'Getting Started',
    tags: ['welcome', 'buildrox'],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'starter-2',
    title: 'Customize your theme and wallpaper in Settings (top right gear icon)',
    description: 'Switch between 5 handcrafted themes (Royal Obsidian, Forest Green, Ocean Blue, Peach Cream, Classic Light) and 6 CSS wallpapers or upload your own.',
    priority: 'medium',
    status: 'active',
    category: 'Design',
    tags: ['themes', 'styling'],
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'starter-3',
    title: 'Create your first personal task using the input bar below',
    description: 'Type a task name, pick a priority, set an optional due date, and hit Enter.',
    priority: 'low',
    status: 'active',
    category: 'Productivity',
    tags: ['action'],
    createdAt: Date.now() - 900000,
  },
];

/**
 * Load tasks safely from localStorage
 */
export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return STARTER_TASKS;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      // First visit: check if initialized
      const hasInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!hasInitialized) {
        saveTasksToStorage(STARTER_TASKS);
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        return STARTER_TASKS;
      }
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Basic sanitize
      return parsed.filter((t): t is Task => Boolean(t && t.id && typeof t.title === 'string'));
    }
    return [];
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
    return [];
  }
}

/**
 * Save tasks safely to localStorage
 */
export function saveTasksToStorage(tasks: Task[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
    return false;
  }
}

/**
 * Load user settings safely from localStorage
 */
export function loadSettingsFromStorage(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings safely to localStorage
 */
export function saveSettingsToStorage(settings: UserSettings): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
    return false;
  }
}

/**
 * Generate and trigger download of JSON backup file
 */
export function exportBackup(tasks: Task[], settings: UserSettings): void {
  const data: BackupData = {
    version: 1,
    appName: 'RoxTasks',
    exportedAt: new Date().toISOString(),
    tasks,
    settings: {
      theme: settings.theme,
      accentColor: settings.accentColor,
      wallpaperMode: settings.wallpaperMode,
      wallpaperPreset: settings.wallpaperPreset,
      wallpaperBlur: settings.wallpaperBlur,
      wallpaperDim: settings.wallpaperDim,
      cardGlassOpacity: settings.cardGlassOpacity,
      layoutDensity: settings.layoutDensity,
      showStats: settings.showStats,
      showGreeting: settings.showGreeting,
      clockFormat: settings.clockFormat,
      userName: settings.userName,
    },
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `roxtasks-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validate and parse an imported backup JSON string
 */
export function parseAndValidateBackup(jsonString: string): {
  success: boolean;
  tasks?: Task[];
  settings?: Partial<UserSettings>;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Invalid JSON file structure.' };
    }

    if (!Array.isArray(data.tasks)) {
      return { success: false, error: 'Backup does not contain a valid tasks list.' };
    }

    const validTasks: Task[] = data.tasks.filter((item: unknown) => {
      if (!item || typeof item !== 'object') return false;
      const t = item as Record<string, unknown>;
      return typeof t.id === 'string' && typeof t.title === 'string';
    }).map((t: Record<string, unknown>): Task => ({
      id: String(t.id || crypto.randomUUID()),
      title: String(t.title || 'Untitled Task'),
      description: typeof t.description === 'string' ? t.description : '',
      priority: (['low', 'medium', 'high'].includes(String(t.priority)) ? t.priority : 'medium') as Task['priority'],
      status: (['active', 'completed'].includes(String(t.status)) ? t.status : 'active') as Task['status'],
      dueDate: typeof t.dueDate === 'string' ? t.dueDate : undefined,
      dueTime: typeof t.dueTime === 'string' ? t.dueTime : undefined,
      category: typeof t.category === 'string' ? t.category : undefined,
      tags: Array.isArray(t.tags) ? (t.tags as string[]) : [],
      createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
      completedAt: typeof t.completedAt === 'number' ? t.completedAt : undefined,
    }));

    return {
      success: true,
      tasks: validTasks,
      settings: data.settings && typeof data.settings === 'object' ? data.settings : undefined,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, error: `Could not parse JSON: ${msg}` };
  }
}
