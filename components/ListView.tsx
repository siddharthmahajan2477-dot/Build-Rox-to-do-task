'use client';

import React from 'react';
import { Check, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Task, TaskStatus, UserSettings } from '@/types/todo';
import { THEMES } from '@/lib/themes';
import { playClickSound, playCompletionSound } from '@/lib/sound';

interface ListViewProps {
  tasks: Task[];
  settings: UserSettings;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  settings,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];
  const isDark = currentTheme.isDark;

  const getStatusBadge = (status: TaskStatus) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>
      );
    }
    if (status === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        To Do
      </span>
    );
  };

  const getPriorityBadge = (p: Task['priority']) => {
    if (p === 'high') {
      return <span className="text-rose-600 dark:text-rose-400 font-semibold text-xs">High</span>;
    }
    if (p === 'medium') {
      return <span className="text-amber-600 dark:text-amber-400 font-semibold text-xs">Medium</span>;
    }
    return <span className="text-sky-600 dark:text-sky-400 font-medium text-xs">Low</span>;
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
        currentTheme.colors.bgCard
      } ${currentTheme.colors.border}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              className={`border-b ${
                isDark ? 'border-slate-800 text-slate-400 bg-slate-900/60' : 'border-slate-100 text-slate-400 bg-slate-50'
              }`}
            >
              <th className="py-3 px-4 font-semibold w-10 text-center">Done</th>
              <th className="py-3 px-4 font-semibold">Task</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Priority</th>
              <th className="py-3 px-4 font-semibold">Due Date</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';

              return (
                <tr
                  key={task.id}
                  className={`group transition-colors ${
                    isDark ? 'hover:bg-slate-800/40 text-slate-200' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {/* Completion checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isCompleted) {
                          playCompletionSound(true);
                          onStatusChange(task.id, 'completed');
                        } else {
                          playClickSound(true);
                          onStatusChange(task.id, 'todo');
                        }
                      }}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors mx-auto ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                      }`}
                    >
                      {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  </td>

                  {/* Task title & description */}
                  <td className="py-3.5 px-4">
                    <div
                      onClick={() => onEdit(task)}
                      className={`font-semibold cursor-pointer hover:underline ${
                        isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : currentTheme.colors.textPrimary
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">{getStatusBadge(task.status)}</td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono">
                    {task.dueDate ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 opacity-60" />
                        <span>{task.dueDate}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Edit task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No tasks yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
