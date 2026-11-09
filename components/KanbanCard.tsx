'use client';

import React, { useState } from 'react';
import {
  MoreHorizontal,
  Calendar,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Task, TaskStatus, UserSettings } from '@/types/todo';
import { THEMES } from '@/lib/themes';
import { playClickSound, playCompletionSound } from '@/lib/sound';

interface KanbanCardProps {
  task: Task;
  settings: UserSettings;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  settings,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];
  const isDark = currentTheme.isDark;

  const isCompleted = task.status === 'completed';

  const getPriorityBadge = (p: Task['priority']) => {
    if (p === 'high') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
          High
        </span>
      );
    }
    if (p === 'medium') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
          Medium
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
        Low
      </span>
    );
  };

  const getRelativeDue = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    return dateStr;
  };

  const dueLabel = getRelativeDue(task.dueDate);

  return (
    <div
      className={`group relative rounded-xl p-3.5 transition-all duration-200 border shadow-xs hover:shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      } ${isCompleted ? 'opacity-80' : 'opacity-100'}`}
      style={{
        opacity: (settings.cardOpacity || 100) / 100,
      }}
    >
      {/* Top Title & Menu */}
      <div className="flex items-start justify-between gap-2">
        <h3
          onClick={() => onEdit(task)}
          className={`text-xs sm:text-sm font-semibold tracking-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors leading-snug ${
            isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : currentTheme.colors.textPrimary
          }`}
        >
          {task.title}
        </h3>

        {/* ... Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Task options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 top-6 z-30 w-44 rounded-xl border p-1 shadow-xl animate-fade-in ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Task</span>
              </button>

              {task.status !== 'todo' && (
                <button
                  onClick={() => {
                    playClickSound(true);
                    onStatusChange(task.id, 'todo');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Move to To Do</span>
                </button>
              )}

              {task.status !== 'in_progress' && (
                <button
                  onClick={() => {
                    playClickSound(true);
                    onStatusChange(task.id, 'in_progress');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Move to In Progress</span>
                </button>
              )}

              {task.status !== 'completed' && (
                <button
                  onClick={() => {
                    playCompletionSound(true);
                    onStatusChange(task.id, 'completed');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>
              )}

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40 dark:text-rose-400 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer: Priority & Due Date */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
        {getPriorityBadge(task.priority)}

        {dueLabel && (
          <div className="flex items-center gap-1 text-slate-400 font-mono">
            <Calendar className="w-3 h-3 opacity-70" />
            <span>{dueLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
