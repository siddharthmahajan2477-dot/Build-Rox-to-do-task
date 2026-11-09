'use client';

import React from 'react';
import { AlertTriangle, Trash2, RefreshCw, X } from 'lucide-react';
import { UserSettings } from '@/types/todo';
import { THEMES } from '@/lib/themes';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  settings: UserSettings;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  settings,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${currentTheme.classes.cardBg} ${currentTheme.classes.cardBorder}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            {isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className={`text-base font-bold tracking-tight ${currentTheme.classes.textPrimary}`}>
              {title}
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${currentTheme.classes.textSecondary}`}>
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${currentTheme.classes.cardBorder} ${currentTheme.classes.textMuted} hover:${currentTheme.classes.textPrimary}`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              isDestructive
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
