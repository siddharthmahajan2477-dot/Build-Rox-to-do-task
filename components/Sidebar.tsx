'use client';

import React from 'react';
import {
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  Settings,
  X,
  ListTodo,
} from 'lucide-react';
import { NavFilter, UserSettings, ThemeId } from '@/types/todo';
import { THEMES } from '@/lib/themes';
import { playClickSound } from '@/lib/sound';

interface SidebarProps {
  activeNav: NavFilter;
  onSelectNav: (nav: NavFilter) => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  taskCounts: {
    all: number;
    today: number;
    upcoming: number;
    completed: number;
    inProgress: number;
  };
  settings: UserSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
  taskCounts,
  settings,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];
  const isDark = currentTheme.isDark;

  const navItems: { id: NavFilter; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'all', label: 'All Tasks', icon: ListTodo, count: taskCounts.all },
    { id: 'today', label: 'Today', icon: Calendar, count: taskCounts.today },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: taskCounts.upcoming },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: taskCounts.completed },
  ];

  const sidebarContent = (
    <div
      className={`h-full flex flex-col justify-between p-5 select-none transition-colors border-r ${
        currentTheme.colors.bgSidebar
      } ${currentTheme.colors.border}`}
    >
      {/* Top Header & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
              }`}
            >
              Rx
            </div>
            <div>
              <span className={`text-base font-bold tracking-tight block leading-none ${currentTheme.colors.textPrimary}`}>
                RoxTasks
              </span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold block mt-0.5 ${currentTheme.colors.textMuted}`}>
                Build Rox
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Separator */}
        <div className={`h-[1px] w-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />

        {/* Primary Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound(true);
                  onSelectNav(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'bg-slate-900 text-white font-semibold shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}

          {/* Settings Nav Item */}
          <button
            onClick={() => {
              playClickSound(true);
              onOpenSettings();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Real Task-Summary Section */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Task Summary
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <span className="text-slate-500">Total Tasks</span>
            <span className="font-mono font-bold">{taskCounts.all}</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <span className="text-blue-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              In Progress
            </span>
            <span className="font-mono font-bold">{taskCounts.inProgress}</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Completed
            </span>
            <span className="font-mono font-bold">{taskCounts.completed}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 pt-2 text-center">
          RoxTasks · Local Storage
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block w-56 h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
