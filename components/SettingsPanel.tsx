'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Palette,
  Image as ImageIcon,
  Upload,
  Trash2,
  RotateCcw,
  Check,
} from 'lucide-react';
import { UserSettings, ThemeId, WallpaperPresetId } from '@/types/todo';
import { THEMES, WALLPAPER_PRESETS } from '@/lib/themes';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import { playClickSound } from '@/lib/sound';

interface SettingsPanelProps {
  isOpen: boolean;
  settings: UserSettings;
  customWallpaperUrl: string | null;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onUploadWallpaper: (file: File) => Promise<void>;
  onRemoveCustomWallpaper: () => Promise<void>;
  onResetAppearance: () => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  settings,
  customWallpaperUrl,
  onUpdateSettings,
  onUploadWallpaper,
  onRemoveCustomWallpaper,
  onResetAppearance,
  onClose,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme] || THEMES['minimal-light'];
  const isDark = currentTheme.isDark;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrorMsg('Please select a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 15MB.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg(null);
      await onUploadWallpaper(file);
      onUpdateSettings({ wallpaperMode: 'custom' });
    } catch (err) {
      setErrorMsg('Could not save wallpaper locally.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl transition-all max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold tracking-tight">Appearance Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-5 text-xs">
          {/* 1. Theme Selector (5 Themes) */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Color Theme (5 Presets)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(THEMES).map((th) => {
                const isSelected = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      playClickSound(true);
                      onUpdateSettings({ theme: th.id });
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-semibold">{th.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Wallpaper Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold uppercase tracking-wider text-slate-400">
                Wallpaper Presets
              </label>
              <button
                onClick={() => onUpdateSettings({ wallpaperMode: 'none' })}
                className={`text-[11px] ${
                  settings.wallpaperMode === 'none' ? 'font-bold text-indigo-600' : 'text-slate-400'
                }`}
              >
                Solid Color
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {WALLPAPER_PRESETS.map((wp) => {
                const isSelected =
                  settings.wallpaperMode === 'preset' && settings.wallpaperPreset === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => {
                      playClickSound(true);
                      onUpdateSettings({ wallpaperMode: 'preset', wallpaperPreset: wp.id });
                    }}
                    className={`h-16 rounded-xl border p-2 flex flex-col justify-between text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                    style={wp.style}
                  >
                    <span className="text-[11px] font-bold text-slate-800 dark:text-white drop-shadow-xs">
                      {wp.name}
                    </span>
                    {isSelected && (
                      <span className="self-end p-0.5 rounded-full bg-indigo-600 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Custom Wallpaper Upload (IndexedDB) */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Custom Image (IndexedDB)
              </span>
              {customWallpaperUrl && (
                <span className="text-[10px] text-emerald-600 font-mono font-bold">Active</span>
              )}
            </div>

            {customWallpaperUrl ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ wallpaperMode: 'custom' })}
                  className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    settings.wallpaperMode === 'custom'
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {settings.wallpaperMode === 'custom' ? 'Selected' : 'Use Uploaded'}
                </button>
                <button
                  type="button"
                  onClick={onRemoveCustomWallpaper}
                  className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Wallpaper (JPG, PNG, WebP)'}</span>
                </button>
              </div>
            )}

            {errorMsg && <p className="text-[11px] text-rose-500 font-medium">{errorMsg}</p>}
          </div>

          {/* 4. Sliders */}
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-slate-500 mb-1">
                <span>Wallpaper Blur</span>
                <span className="font-mono">{settings.wallpaperBlur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                value={settings.wallpaperBlur}
                onChange={(e) => onUpdateSettings({ wallpaperBlur: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-500 mb-1">
                <span>Background Dimming</span>
                <span className="font-mono">{settings.wallpaperDim}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                value={settings.wallpaperDim}
                onChange={(e) => onUpdateSettings({ wallpaperDim: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-500 mb-1">
                <span>Card Opacity</span>
                <span className="font-mono">{settings.cardOpacity}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={settings.cardOpacity}
                onChange={(e) => onUpdateSettings({ cardOpacity: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Reset Appearance */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onResetAppearance}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Appearance to Default</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1">
              Resets styling only. Your tasks will not be deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
