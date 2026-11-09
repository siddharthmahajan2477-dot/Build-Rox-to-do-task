'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Task, TaskStatus, UserSettings } from '@/types/todo';
import { THEMES } from '@/lib/themes';
import { KanbanCard } from './KanbanCard';
import { playClickSound } from '@/lib/sound';

interface BoardViewProps {
  tasks: Task[];
  settings: UserSettings;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTaskInColumn: (status: TaskStatus) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  tasks,
  settings,
  onEdit,
  onDelete,
  onStatusChange,
  onAddTaskInColumn,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];
  const isDark = currentTheme.isDark;

  const columns: { id: TaskStatus; label: string; dotClass: string }[] = [
    { id: 'todo', label: 'To Do', dotClass: 'bg-amber-400' },
    { id: 'in_progress', label: 'In Progress', dotClass: 'bg-blue-500' },
    { id: 'completed', label: 'Completed', dotClass: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-10">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className={`rounded-2xl p-4 transition-colors flex flex-col ${
              currentTheme.colors.bgColumn
            } border ${currentTheme.colors.border}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                <h2 className={`text-sm font-bold tracking-tight ${currentTheme.colors.textPrimary}`}>
                  {col.label}
                </h2>
                <span className={`text-xs font-mono font-semibold ml-1 ${currentTheme.colors.textMuted}`}>
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks Container */}
            <div className="space-y-3 flex-1 min-h-[140px]">
              {colTasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  settings={settings}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}

              {/* Empty state when no tasks exist */}
              {colTasks.length === 0 && (
                <div className="h-32 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-xs text-slate-400">
                  <span>No tasks yet</span>
                </div>
              )}
            </div>

            {/* Functional Add Task Button in Column */}
            <button
              onClick={() => {
                playClickSound(true);
                onAddTaskInColumn(col.id);
              }}
              className={`mt-3 w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
