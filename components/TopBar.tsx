'use client';

import React from 'react';
import {
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Palette,
  Plus,
  Menu,
} from 'lucide-react';
import { ViewMode, SortOption, UserSettings } from '@/types/todo';
import { THEMES } from '@/lib/themes';
import { playClickSound } from '@/lib/sound';

interface TopBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenNewTask: () => void;
  onOpenSettings: () => void;
  onOpenMobileMenu: () => void;
  settings: UserSettings;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenNewTask,
  onOpenSettings,
  onOpenMobileMenu,
  settings,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];
  const isDark = currentTheme.isDark;

  return (
    <header
      className={`border-b px-6 py-4 transition-colors select-none ${
        currentTheme.colors.bgSidebar
      } ${currentTheme.colors.border}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Heading & Subtitle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${currentTheme.colors.textPrimary}`}>
              My Tasks
            </h1>
            <p className={`text-xs ${currentTheme.colors.textMuted}`}>
              Organize your day, your way.
            </p>
          </div>
        </div>

        {/* Right: Functional Minimal Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Tasks Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className={`pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none w-36 sm:w-48 transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Board / List View Toggle */}
          <div
            className={`flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                playClickSound(true);
                onViewModeChange('board');
              }}
              title="Kanban Board View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'board'
                  ? isDark
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playClickSound(true);
                onViewModeChange('list');
              }}
              title="Table List View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? isDark
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                playClickSound(true);
                onSortChange(e.target.value as SortOption);
              }}
              className={`pl-7 pr-3 py-1.5 text-xs font-medium rounded-xl border appearance-none cursor-pointer focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="due-date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Theme Settings Icon */}
          <button
            onClick={() => {
              playClickSound(true);
              onOpenSettings();
            }}
            title="Appearance & Theme Settings"
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {/* + New Task Primary Button */}
          <button
            onClick={() => {
              playClickSound(true);
              onOpenNewTask();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-opacity ${
              currentTheme.colors.accentBtn
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
