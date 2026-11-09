import { Task, UserSettings } from '@/types/todo';

export const STORAGE_KEYS = {
  TASKS: 'roxtasks_clean_tasks_v3',
  SETTINGS: 'roxtasks_clean_settings_v3',
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'minimal-light',
  accentColor: '#0F172A',
  wallpaperMode: 'preset',
  wallpaperPreset: 'minimal-white',
  wallpaperBlur: 0,
  wallpaperDim: 0,
  cardOpacity: 100,
};

/**
 * Loads tasks strictly from browser localStorage.
 * Guaranteed to return an empty array [] on first launch.
 */
export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return []; // Completely empty on first launch!

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is Task => Boolean(t && t.id && typeof t.title === 'string'));
    }
    return [];
  } catch (err) {
    console.warn('Failed to load tasks from localStorage:', err);
    return [];
  }
}

/**
 * Persist tasks to browser localStorage
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
 * Load settings from browser localStorage
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
    console.warn('Failed to load settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Persist settings to browser localStorage
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
