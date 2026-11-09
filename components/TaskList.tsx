'use client';

import React, { useState } from 'react';
import { CheckCircle2, ListTodo, SearchX, Sparkles, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Task, UserSettings, FilterStatus } from '@/types/todo';
import { THEMES, ACCENT_COLORS } from '@/lib/themes';
import { TaskCard } from './TaskCard';
import { playClickSound } from '@/lib/sound';

interface TaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  settings: UserSettings;
  filter: FilterStatus;
  searchQuery: string;
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onOpenNewTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filteredTasks,
  settings,
  filter,
  searchQuery,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenNewTask,
}) => {
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  // Separate active vs completed if in 'all' view
  const activeTasks = filteredTasks.filter((t) => t.status === 'active');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  // Handle Empty States
  if (tasks.length === 0) {
    return (
      <div
        className="rounded-2xl border p-8 sm:p-12 text-center transition-all duration-300"
        style={{
          backgroundColor: currentTheme.isDark
            ? `rgba(18, 21, 28, ${settings.cardGlassOpacity / 100})`
            : `rgba(255, 255, 255, ${settings.cardGlassOpacity / 100})`,
          borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
          <ListTodo className="w-7 h-7 opacity-80" />
        </div>
        <h3 className={`text-lg sm:text-xl font-bold tracking-tight mb-2 ${currentTheme.classes.textPrimary}`}>
          Your task board is completely clear
        </h3>
        <p className={`text-sm max-w-md mx-auto mb-6 ${currentTheme.classes.textSecondary}`}>
          Start your focus session now. Create your first task, prioritize what matters, and experience local-first productivity.
        </p>
        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            onOpenNewTask();
          }}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all ${currentAccent.buttonClass}`}
        >
          <Plus className="w-4 h-4" />
          <span>Create Your First Task</span>
        </button>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          backgroundColor: currentTheme.isDark
            ? `rgba(18, 21, 28, ${settings.cardGlassOpacity / 100})`
            : `rgba(255, 255, 255, ${settings.cardGlassOpacity / 100})`,
          borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center mb-3 text-slate-400">
          <SearchX className="w-6 h-6 opacity-70" />
        </div>
        <h3 className={`text-base font-semibold mb-1 ${currentTheme.classes.textPrimary}`}>
          No matching tasks found
        </h3>
        <p className={`text-xs ${currentTheme.classes.textMuted}`}>
          {searchQuery
            ? `No tasks match your search "${searchQuery}". Try different keywords.`
            : `No tasks found in the "${filter}" filter.`}
        </p>
      </div>
    );
  }

  // When filtering specifically by 'active' or 'completed' or 'today'
  if (filter !== 'all') {
    return (
      <div className="space-y-2.5">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            settings={settings}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // In 'all' view: Show active tasks first, followed by collapsible completed tasks
  return (
    <div className="space-y-5">
      {/* Active Tasks Group */}
      {activeTasks.length > 0 && (
        <div className="space-y-2.5">
          {activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              settings={settings}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Completed Tasks Group (Collapsible) */}
      {completedTasks.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              playClickSound(settings.soundEnabled);
              setIsCompletedOpen(!isCompletedOpen);
            }}
            className={`w-full flex items-center justify-between py-2 text-xs font-medium ${currentTheme.classes.textMuted} hover:${currentTheme.classes.textSecondary} transition-colors`}
          >
            <div className="flex items-center gap-2">
              {isCompletedOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span>Completed ({completedTasks.length})</span>
            </div>
            <span className="text-[11px] opacity-60">
              {isCompletedOpen ? 'Hide' : 'Show'}
            </span>
          </button>

          {isCompletedOpen && (
            <div className="space-y-2.5 mt-2">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  settings={settings}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
