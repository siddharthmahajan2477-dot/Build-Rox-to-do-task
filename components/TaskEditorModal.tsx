'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Task, TaskPriority, UserSettings } from '@/types/todo';
import { THEMES, ACCENT_COLORS } from '@/lib/themes';
import { playClickSound } from '@/lib/sound';

interface TaskEditorModalProps {
  task: Task | null;
  isOpen: boolean;
  settings: UserSettings;
  onSave: (updatedTask: Task) => void;
  onClose: () => void;
}

interface TaskEditorModalContentProps {
  task: Task;
  settings: UserSettings;
  onSave: (updatedTask: Task) => void;
  onClose: () => void;
}

const TaskEditorModalContent: React.FC<TaskEditorModalContentProps> = ({
  task,
  settings,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [category, setCategory] = useState(task.category || '');

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSave({
      ...task,
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      category: category.trim() || undefined,
      tags: category.trim() ? [category.trim().toLowerCase()] : task.tags,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${currentTheme.classes.cardBg} ${currentTheme.classes.cardBorder}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className={`text-lg font-bold tracking-tight ${currentTheme.classes.textPrimary}`}>
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-xs font-medium uppercase tracking-wider mb-1.5 ${currentTheme.classes.textMuted}`}>
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
              className={`w-full px-3 py-2 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-400/50 ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textPrimary}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-medium uppercase tracking-wider mb-1.5 ${currentTheme.classes.textMuted}`}>
              Notes / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional context, sub-items, or links..."
              rows={3}
              className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm transition-colors resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400/50 ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textPrimary} placeholder:text-slate-500`}
            />
          </div>

          {/* Priority */}
          <div>
            <label className={`block text-xs font-medium uppercase tracking-wider mb-1.5 ${currentTheme.classes.textMuted}`}>
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                const isSelected = priority === p;
                let activeStyle = '';
                if (p === 'low') activeStyle = isSelected ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold' : 'border-slate-800 text-slate-400 hover:border-slate-600';
                if (p === 'medium') activeStyle = isSelected ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold' : 'border-slate-800 text-slate-400 hover:border-slate-600';
                if (p === 'high') activeStyle = isSelected ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-semibold' : 'border-slate-800 text-slate-400 hover:border-slate-600';

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      playClickSound(settings.soundEnabled);
                      setPriority(p);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs capitalize text-center transition-all ${activeStyle}`}
                  >
                    {p} Priority
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider mb-1.5 ${currentTheme.classes.textMuted}`}>
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textSecondary}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider mb-1.5 ${currentTheme.classes.textMuted}`}>
                Category / Tag
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Work, Personal"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textSecondary} placeholder:text-slate-600`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${currentTheme.classes.cardBorder} ${currentTheme.classes.textMuted} hover:${currentTheme.classes.textPrimary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className={`px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-40 ${currentAccent.buttonClass}`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TaskEditorModal: React.FC<TaskEditorModalProps> = ({
  task,
  isOpen,
  settings,
  onSave,
  onClose,
}) => {
  if (!isOpen || !task) return null;

  return (
    <TaskEditorModalContent
      key={task.id}
      task={task}
      settings={settings}
      onSave={onSave}
      onClose={onClose}
    />
  );
};
