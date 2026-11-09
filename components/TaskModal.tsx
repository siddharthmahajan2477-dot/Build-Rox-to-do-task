'use client';

import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, UserSettings } from '@/types/todo';
import { THEMES } from '@/lib/themes';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  defaultStatus?: TaskStatus;
  settings: UserSettings;
  onSave: (task: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => void;
  onClose: () => void;
}

interface TaskModalContentProps {
  task: Task | null;
  defaultStatus?: TaskStatus;
  settings: UserSettings;
  onSave: (task: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => void;
  onClose: () => void;
}

const TaskModalContent: React.FC<TaskModalContentProps> = ({
  task,
  defaultStatus = 'todo',
  settings,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || defaultStatus);
  const [dueDate, setDueDate] = useState(task?.dueDate || '');

  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];
  const isDark = currentTheme.isDark;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate || undefined,
      completedAt: status === 'completed' ? (task?.completedAt || Date.now()) : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-5 shadow-xl transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold tracking-tight">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add optional notes or details..."
              className={`w-full px-3 py-2 rounded-xl border text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Column Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={`w-full px-3 py-2 rounded-xl border font-medium focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="todo">🟡 To Do</option>
                <option value="in_progress">🔵 In Progress</option>
                <option value="completed">🟢 Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className={`w-full px-3 py-2 rounded-xl border font-medium focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border font-mono font-medium focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-medium text-slate-500 hover:text-slate-700 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs disabled:opacity-40"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  defaultStatus,
  settings,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <TaskModalContent
      key={task?.id || 'new'}
      task={task}
      defaultStatus={defaultStatus}
      settings={settings}
      onSave={onSave}
      onClose={onClose}
    />
  );
};
