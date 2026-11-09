'use client';

import React from 'react';
import { CheckCircle2, Clock, ListTodo, Calendar, AlertCircle } from 'lucide-react';
import { Task, UserSettings } from '@/types/todo';
import { THEMES, ACCENT_COLORS } from '@/lib/themes';

interface DashboardStatsProps {
  tasks: Task[];
  settings: UserSettings;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ tasks, settings }) => {
  if (!settings.showStats) return null;

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const active = tasks.filter((t) => t.status === 'active').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueToday = tasks.filter((t) => t.status === 'active' && t.dueDate === todayStr).length;

  const overdue = tasks.filter((t) => {
    if (t.status !== 'active' || !t.dueDate) return false;
    return t.dueDate < todayStr;
  }).length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Circular ring math
  const strokeWidth = 5;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const statCardStyle = {
    backgroundColor: currentTheme.isDark
      ? `rgba(18, 21, 28, ${settings.cardGlassOpacity / 100})`
      : `rgba(255, 255, 255, ${settings.cardGlassOpacity / 100})`,
    borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(12px)',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 1. Progress Indicator Card */}
      <div
        className={`col-span-2 sm:col-span-1 rounded-2xl border p-4.5 flex items-center justify-between transition-all duration-200`}
        style={statCardStyle}
      >
        <div>
          <div className={`text-xs font-medium uppercase tracking-wider ${currentTheme.classes.textMuted} mb-1`}>
            Progress
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono tabular-nums ${currentTheme.classes.textPrimary}`}>
              {percentage}%
            </span>
          </div>
          <div className={`text-[11px] ${currentTheme.classes.textMuted} mt-0.5`}>
            {completed} of {total} done
          </div>
        </div>

        {/* Circular Ring */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 68 68">
            <circle
              cx="34"
              cy="34"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className={`text-slate-700/30`}
              fill="transparent"
            />
            <circle
              cx="34"
              cy="34"
              r={radius}
              stroke={currentAccent.hex}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold font-mono tabular-nums opacity-90">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Tasks */}
      <div
        className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-200`}
        style={statCardStyle}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
            Total Tasks
          </span>
          <ListTodo className="w-4 h-4 opacity-50" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${currentTheme.classes.textPrimary}`}>
            {total}
          </span>
          <span className={`text-[11px] ${currentTheme.classes.textMuted}`}>all-time</span>
        </div>
      </div>

      {/* 3. Active Tasks */}
      <div
        className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-200`}
        style={statCardStyle}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
            Active
          </span>
          <Clock className="w-4 h-4 text-sky-400 opacity-80" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${currentTheme.classes.textPrimary}`}>
            {active}
          </span>
          <span className={`text-[11px] ${currentTheme.classes.textMuted}`}>pending</span>
        </div>
      </div>

      {/* 4. Completed Tasks */}
      <div
        className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-200`}
        style={statCardStyle}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
            Completed
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-80" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${currentTheme.classes.textPrimary}`}>
            {completed}
          </span>
          <span className={`text-[11px] text-emerald-400/80`}>cleared</span>
        </div>
      </div>

      {/* 5. Due Today / Overdue */}
      <div
        className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-200`}
        style={statCardStyle}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
            {overdue > 0 ? 'Due / Overdue' : 'Due Today'}
          </span>
          {overdue > 0 ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <Calendar className="w-4 h-4 text-amber-400 opacity-80" />
          )}
        </div>
        <div className="flex items-baseline justify-between">
          <span
            className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
              overdue > 0 ? 'text-rose-400' : currentTheme.classes.textPrimary
            }`}
          >
            {overdue > 0 ? `${overdue} overdue` : dueToday}
          </span>
          <span className={`text-[11px] ${currentTheme.classes.textMuted}`}>
            {overdue > 0 ? `+${dueToday} today` : 'on schedule'}
          </span>
        </div>
      </div>
    </div>
  );
};
