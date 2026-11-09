'use client';

import React from 'react';
import { Search, ArrowUpDown, X, Trash2, CheckCircle2 } from 'lucide-react';
import { FilterStatus, SortOption, UserSettings, Task } from '@/types/todo';
import { THEMES, ACCENT_COLORS } from '@/lib/themes';
import { playClickSound } from '@/lib/sound';

interface FilterBarProps {
  settings: UserSettings;
  tasks: Task[];
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  onClearCompleted: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  settings,
  tasks,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedTag,
  onTagChange,
  onClearCompleted,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  const todayStr = new Date().toISOString().split('T')[0];

  // Counts for tabs
  const allCount = tasks.length;
  const activeCount = tasks.filter((t) => t.status === 'active').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const todayCount = tasks.filter((t) => t.status === 'active' && t.dueDate === todayStr).length;
  const overdueCount = tasks.filter((t) => t.status === 'active' && t.dueDate && t.dueDate < todayStr).length;

  // Extract all unique categories/tags
  const allTags = Array.from(
    new Set(
      tasks
        .map((t) => t.category)
        .filter((cat): cat is string => Boolean(cat && cat.trim()))
    )
  );

  const filterTabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: allCount },
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'completed', label: 'Completed', count: completedCount },
    { id: 'today', label: 'Today', count: todayCount },
    ...(overdueCount > 0 ? [{ id: 'overdue' as FilterStatus, label: 'Overdue', count: overdueCount }] : []),
  ];

  return (
    <div className="space-y-3">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Segmented Filter Buttons */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto no-scrollbar shrink-0`}
          style={{
            backgroundColor: currentTheme.isDark ? 'rgba(18, 21, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  onFilterChange(tab.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? `${currentTheme.classes.cardBg} ${currentTheme.classes.textPrimary} shadow-sm border ${currentTheme.classes.cardBorder}`
                    : `${currentTheme.classes.textMuted} hover:${currentTheme.classes.textSecondary}`
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono tabular-nums opacity-70">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5 flex-1 max-w-full md:max-w-md justify-end">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 opacity-60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className={`w-full pl-8 pr-7 py-1.5 rounded-xl border text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-400/50 ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textPrimary} placeholder:text-slate-500`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0 flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none opacity-60" />
            <select
              value={sortBy}
              onChange={(e) => {
                playClickSound(settings.soundEnabled);
                onSortChange(e.target.value as SortOption);
              }}
              className={`pl-7 pr-3 py-1.5 rounded-xl border text-xs font-medium appearance-none focus:outline-none cursor-pointer ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textSecondary}`}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="due-date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">A — Z</option>
            </select>
          </div>

          {/* Clear completed button */}
          {completedCount > 0 && (
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                onClearCompleted();
              }}
              title="Clear all completed tasks"
              className="px-2.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium flex items-center gap-1 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tag Filters (if any) */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className={`text-[11px] ${currentTheme.classes.textMuted} mr-1 whitespace-nowrap`}>
            Categories:
          </span>
          <button
            onClick={() => onTagChange(null)}
            className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedTag === null
                ? 'bg-slate-700/60 text-white font-semibold'
                : `${currentTheme.classes.textMuted} hover:${currentTheme.classes.textSecondary}`
            }`}
          >
            All Categories
          </button>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onTagChange(isSelected ? null : tag)}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  isSelected
                    ? `${currentAccent.badgeClass} border font-semibold`
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
