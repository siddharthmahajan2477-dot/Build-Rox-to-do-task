'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Edit2, Check } from 'lucide-react';
import { UserSettings, Task } from '@/types/todo';
import { THEMES } from '@/lib/themes';

interface GreetingBannerProps {
  settings: UserSettings;
  tasks: Task[];
  onUpdateUserName: (name: string) => void;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({
  settings,
  tasks,
  onUpdateUserName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(settings.userName || 'Builder');

  if (!settings.showGreeting) return null;

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];

  // Calculate dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Working Late';
  };

  const activeCount = tasks.filter((t) => t.status === 'active').length;
  const completedTodayCount = tasks.filter((t) => {
    if (t.status !== 'completed' || !t.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(t.completedAt).toDateString() === today;
  }).length;

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      onUpdateUserName(trimmed);
    }
    setIsEditingName(false);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all duration-300 shadow-sm`}
      style={{
        backgroundColor: currentTheme.isDark
          ? `rgba(18, 21, 28, ${settings.cardGlassOpacity / 100})`
          : `rgba(255, 255, 255, ${settings.cardGlassOpacity / 100})`,
        borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${currentTheme.classes.textPrimary} flex items-center gap-2`}>
              <span>{getGreeting()},</span>
              {isEditingName ? (
                <span className="inline-flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    className={`text-2xl sm:text-3xl font-bold bg-transparent border-b border-indigo-400 focus:outline-none px-1 max-w-[200px] ${currentTheme.classes.textPrimary}`}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                    title="Save name"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </span>
              ) : (
                <span
                  onClick={() => setIsEditingName(true)}
                  className="cursor-pointer group inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                  title="Click to change your display name"
                >
                  <span>{settings.userName || 'Builder'}</span>
                  <Edit2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                </span>
              )}
            </h1>
          </div>

          <p className={`text-sm ${currentTheme.classes.textSecondary} flex items-center gap-2`}>
            <span>Make today count.</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>
              {activeCount === 0
                ? 'All clear! No active tasks right now.'
                : `${activeCount} task${activeCount === 1 ? '' : 's'} waiting for your focus today.`}
            </span>
          </p>
        </div>

        {/* Quick status badge */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <div
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 ${currentTheme.classes.subtleBg} ${currentTheme.classes.cardBorder}`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className={currentTheme.classes.textSecondary}>
              <strong className={`font-semibold ${currentTheme.classes.textPrimary} font-mono tabular-nums`}>
                {completedTodayCount}
              </strong>{' '}
              completed today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
