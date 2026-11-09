'use client';

import React, { useState, useRef } from 'react';
import { Plus, Calendar, Tag, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Task, TaskPriority, UserSettings } from '@/types/todo';
import { THEMES, ACCENT_COLORS } from '@/lib/themes';
import { playClickSound } from '@/lib/sound';

interface TaskInputProps {
  settings: UserSettings;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  settings,
  onAddTask,
  inputRef,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const localInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || localInputRef;

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask({
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      category: category.trim() || undefined,
      tags: category.trim() ? [category.trim().toLowerCase()] : [],
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setCategory('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 shadow-sm`}
      style={{
        backgroundColor: currentTheme.isDark
          ? `rgba(18, 21, 28, ${settings.cardGlassOpacity / 100})`
          : `rgba(255, 255, 255, ${settings.cardGlassOpacity / 100})`,
        borderColor: currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <form onSubmit={handleSubmit} className="p-3.5 sm:p-4">
        {/* Main Title Row */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 opacity-60">
            <Plus className="w-5 h-5" />
          </div>

          <input
            ref={activeInputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task... (Press Enter to save)"
            className={`flex-1 bg-transparent text-sm sm:text-base font-medium placeholder:text-slate-500 focus:outline-none ${currentTheme.classes.textPrimary}`}
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? 'Collapse options' : 'More task details'}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${currentTheme.classes.subtleBg} ${currentTheme.classes.cardBorder} ${currentTheme.classes.textSecondary} hover:border-slate-500`}
            >
              <span className="hidden sm:inline text-[11px]">Options</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${currentAccent.buttonClass}`}
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Expandable Rich Options */}
        {isExpanded && (
          <div className="mt-3.5 pt-3.5 border-t border-white/5 space-y-3 animate-task-pop">
            {/* Description textarea */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes, steps, or description..."
                rows={2}
                className={`w-full p-2.5 rounded-xl text-xs sm:text-sm border transition-colors resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400/50 ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textPrimary} placeholder:text-slate-500`}
              />
            </div>

            {/* Controls row: Priority, Due Date, Category */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Priority Selectors */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] ${currentTheme.classes.textMuted} mr-1`}>Priority:</span>
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p;
                  let colorClass = 'border-slate-700 text-slate-400';
                  if (p === 'low') colorClass = isSelected ? 'bg-sky-500/20 border-sky-400 text-sky-300' : 'hover:border-sky-500/50';
                  if (p === 'medium') colorClass = isSelected ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'hover:border-amber-500/50';
                  if (p === 'high') colorClass = isSelected ? 'bg-rose-500/20 border-rose-400 text-rose-300' : 'hover:border-rose-500/50';

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setPriority(p);
                      }}
                      className={`px-2.5 py-1 rounded-md border text-[11px] font-medium capitalize transition-all ${colorClass}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Due Date & Category */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`px-2 py-1 rounded-md border text-[11px] font-mono focus:outline-none ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textSecondary}`}
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category (e.g. Work)"
                    className={`px-2 py-1 rounded-md border text-[11px] w-28 focus:outline-none ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textSecondary} placeholder:text-slate-600`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
