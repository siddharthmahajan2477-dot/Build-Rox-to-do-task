'use client';

import React, { useState } from 'react';
import { Check, Edit3, Trash2, Calendar, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Task, UserSettings } from '@/types/todo';
import { THEMES, ACCENT_COLORS } from '@/lib/themes';
import { playCompletionSound, playClickSound } from '@/lib/sound';

interface TaskCardProps {
  task: Task;
  settings: UserSettings;
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  settings,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  const isCompleted = task.status === 'completed';
  const isCompact = settings.layoutDensity === 'compact';

  // Format Due Date & Overdue Status
  const getDueStatus = () => {
    if (!task.dueDate) return null;
    const today = new Date().toISOString().split('T')[0];
    
    // Check overdue
    const isOverdue = !isCompleted && task.dueDate < today;

    // Relative string
    let label = task.dueDate;
    if (task.dueDate === today) {
      label = 'Today';
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      if (task.dueDate === tomorrowStr) {
        label = 'Tomorrow';
      }
    }

    return { label, isOverdue };
  };

  const dueStatus = getDueStatus();

  // Priority metadata text & subtle dot
  const getPriorityStyle = () => {
    if (task.priority === 'high') {
      return { dot: 'bg-rose-500', text: 'text-rose-400', label: 'High Priority' };
    }
    if (task.priority === 'medium') {
      return { dot: 'bg-amber-500', text: 'text-amber-400', label: 'Medium Priority' };
    }
    return { dot: 'bg-sky-500', text: 'text-sky-400', label: 'Low Priority' };
  };

  const priorityStyle = getPriorityStyle();

  const handleCheckboxClick = () => {
    if (!isCompleted) {
      playCompletionSound(settings.soundEnabled);
    } else {
      playClickSound(settings.soundEnabled);
    }
    onToggleStatus(task.id);
  };

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        isCompact ? 'p-3' : 'p-4 sm:p-4.5'
      } ${isCompleted ? 'opacity-70' : 'opacity-100'} hover:border-slate-600/60`}
      style={{
        backgroundColor: currentTheme.isDark
          ? `rgba(18, 21, 28, ${settings.cardGlassOpacity / 100})`
          : `rgba(255, 255, 255, ${settings.cardGlassOpacity / 100})`,
        borderColor: isCompleted
          ? currentTheme.isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'
          : currentTheme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Checkbox button */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          onClick={handleCheckboxClick}
          className={`relative w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-400 text-white'
              : `border-slate-600 hover:border-indigo-400 ${currentTheme.classes.inputBg}`
          }`}
          title={isCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              onClick={handleCheckboxClick}
              className={`text-sm sm:text-base font-medium tracking-tight cursor-pointer select-none transition-all break-words ${
                isCompleted
                  ? 'line-through text-slate-500 dark:text-slate-500'
                  : currentTheme.classes.textPrimary
              }`}
            >
              {task.title}
            </h3>

            {/* Actions: Edit & Delete buttons */}
            <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                type="button"
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  onEdit(task);
                }}
                className={`p-1.5 rounded-lg border text-slate-400 hover:text-white hover:border-slate-500 transition-colors ${currentTheme.classes.subtleBg} ${currentTheme.classes.cardBorder}`}
                title="Edit task"
                aria-label="Edit task"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  onDelete(task.id);
                }}
                className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description preview or expanded text */}
          {task.description && (
            <div className="mt-1.5">
              <p
                className={`text-xs ${currentTheme.classes.textMuted} whitespace-pre-wrap leading-relaxed ${
                  !isExpanded ? 'line-clamp-2' : ''
                }`}
              >
                {task.description}
              </p>
              {task.description.length > 100 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 text-[11px] text-indigo-400 hover:underline flex items-center gap-0.5 font-medium"
                >
                  <span>{isExpanded ? 'Show less' : 'Show full notes'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          )}

          {/* Unboxed Metadata Line (Frontend Design Constitution: Zero-Pill rule) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
            {/* Priority Indicator */}
            <div className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
              <span className={priorityStyle.text}>{priorityStyle.label}</span>
            </div>

            {/* Due Date Indicator */}
            {dueStatus && (
              <>
                <span className="opacity-30" aria-hidden="true">·</span>
                <div
                  className={`inline-flex items-center gap-1 font-mono text-[11px] ${
                    dueStatus.isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {dueStatus.isOverdue ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5 opacity-60" />
                  )}
                  <span>{dueStatus.isOverdue ? `Overdue (${dueStatus.label})` : `Due ${dueStatus.label}`}</span>
                </div>
              </>
            )}

            {/* Category / Tags */}
            {task.category && (
              <>
                <span className="opacity-30" aria-hidden="true">·</span>
                <span className="text-slate-400 font-medium">
                  {task.category}
                </span>
              </>
            )}

            {/* Completion Timestamp */}
            {isCompleted && task.completedAt && (
              <>
                <span className="opacity-30" aria-hidden="true">·</span>
                <span className="text-[11px] text-emerald-400/80 font-mono">
                  Done {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
