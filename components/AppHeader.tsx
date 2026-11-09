'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Plus, Calendar, Clock, Download, Sparkles } from 'lucide-react';
import { UserSettings } from '@/types/todo';
import { THEMES, ACCENT_COLORS } from '@/lib/themes';
import { playClickSound } from '@/lib/sound';

interface AppHeaderProps {
  settings: UserSettings;
  onOpenSettings: () => void;
  onOpenQuickNewTask?: () => void;
  onQuickBackup?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  settings,
  onOpenSettings,
  onOpenQuickNewTask,
  onQuickBackup,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Date format: e.g. "Monday, Nov 9"
      const dateStr = now.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setCurrentDate(dateStr);

      // Time format based on user preference
      const timeStr = now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: settings.clockFormat === '12h',
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.clockFormat]);

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.isDark ? 'rgba(10, 12, 18, 0.75)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 flex items-center justify-center shadow-md border border-white/10 text-white font-bold tracking-tight">
            <span className="text-sm bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">Rx</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold tracking-tight ${currentTheme.classes.textPrimary} whitespace-nowrap`}>
                RoxTasks
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide text-slate-400/80 bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase">
                Build Rox
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Live Local Clock & Date */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            <span className="text-slate-300 font-medium">{currentDate || 'Today'}</span>
          </div>
          <span className="opacity-30" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5 whitespace-nowrap font-mono tabular-nums">
            <Clock className="w-3.5 h-3.5 opacity-70" />
            <span className="text-slate-200 font-semibold">{currentTime || '--:--:--'}</span>
          </div>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onQuickBackup && (
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                onQuickBackup();
              }}
              title="Quick Backup JSON"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${currentTheme.classes.cardBg} ${currentTheme.classes.cardBorder} ${currentTheme.classes.textSecondary} hover:border-slate-500 hover:text-white`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
          )}

          {onOpenQuickNewTask && (
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                onOpenQuickNewTask();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${currentAccent.buttonClass}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">New Task</span>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound(settings.soundEnabled);
              onOpenSettings();
            }}
            aria-label="Open Appearance and Settings"
            className={`p-2 rounded-lg border transition-all ${currentTheme.classes.cardBg} ${currentTheme.classes.cardBorder} ${currentTheme.classes.textSecondary} hover:border-slate-500 hover:text-white`}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
