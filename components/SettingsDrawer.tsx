'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Palette,
  Layout,
  Sliders,
  Database,
  Upload,
  Trash2,
  RotateCcw,
  Download,
  FileUp,
  Check,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import {
  UserSettings,
  ThemeId,
  AccentColor,
  WallpaperPresetId,
  WallpaperMode,
} from '@/types/todo';
import { THEMES, ACCENT_COLORS, WALLPAPER_PRESETS } from '@/lib/themes';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import { playClickSound } from '@/lib/sound';

interface SettingsDrawerProps {
  isOpen: boolean;
  settings: UserSettings;
  customWallpaperUrl: string | null;
  customWallpaperFileName: string | null;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onUploadWallpaper: (file: File) => Promise<void>;
  onRemoveCustomWallpaper: () => Promise<void>;
  onResetAppearance: () => void;
  onExportBackup: () => void;
  onImportBackupFile: (file: File) => void;
  onClearAllTasks: () => void;
  onClose: () => void;
}

type TabType = 'appearance' | 'layout' | 'preferences' | 'data';

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  settings,
  customWallpaperUrl,
  customWallpaperFileName,
  onUpdateSettings,
  onUploadWallpaper,
  onRemoveCustomWallpaper,
  onResetAppearance,
  onExportBackup,
  onImportBackupFile,
  onClearAllTasks,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];
  const currentAccent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.titanium;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a JPG, PNG, or WebP image.');
      return;
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      await onUploadWallpaper(file);
      onUpdateSettings({ wallpaperMode: 'custom' });
    } catch (err: unknown) {
      setUploadError('Failed to save wallpaper locally.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImportBackupFile(file);
    if (importInputRef.current) importInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`absolute inset-y-0 right-0 max-w-full flex pl-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-screen max-w-md border-l shadow-2xl flex flex-col transition-all duration-300 ${currentTheme.classes.cardBg} ${currentTheme.classes.cardBorder}`}
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className={`text-base font-bold tracking-tight ${currentTheme.classes.textPrimary}`}>
                Control Center
              </h2>
              <p className={`text-xs ${currentTheme.classes.textMuted}`}>
                Personalize theme, wallpaper & storage
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/5 px-4 gap-2 text-xs font-medium overflow-x-auto no-scrollbar">
            {[
              { id: 'appearance' as TabType, label: 'Appearance', icon: Palette },
              { id: 'layout' as TabType, label: 'Layout', icon: Layout },
              { id: 'preferences' as TabType, label: 'Preferences', icon: Sliders },
              { id: 'data' as TabType, label: 'Data & Backup', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound(settings.soundEnabled);
                    setActiveTab(tab.id);
                  }}
                  className={`py-3 px-2 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? `border-indigo-400 font-semibold ${currentTheme.classes.textPrimary}`
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 1. APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                {/* Theme Selector */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${currentTheme.classes.textPrimary}`}>
                    Color Theme (5 Presets)
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {Object.values(THEMES).map((th) => {
                      const isSelected = settings.theme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => {
                            playClickSound(settings.soundEnabled);
                            onUpdateSettings({ theme: th.id });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-indigo-400 ring-1 ring-indigo-400/40 bg-white/5'
                              : 'border-white/5 hover:border-white/20 bg-black/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${th.isDark ? 'text-white' : 'text-slate-900'}`}>
                                {th.name}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                            </div>
                            <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {th.description}
                            </span>
                          </div>

                          {/* Color Swatch Dots */}
                          <div className="flex items-center gap-1 shrink-0 ml-3">
                            {th.previewColors.map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Color Override */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${currentTheme.classes.textPrimary}`}>
                    Accent Tone
                  </label>
                  <div className="flex items-center gap-2.5">
                    {Object.values(ACCENT_COLORS).map((acc) => {
                      const isSelected = settings.accentColor === acc.id;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            playClickSound(settings.soundEnabled);
                            onUpdateSettings({ accentColor: acc.id });
                          }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: acc.hex }}
                          title={acc.name}
                        >
                          {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wallpaper Gallery & Mode */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.classes.textPrimary}`}>
                      Wallpaper Presets (6 CSS Presets)
                    </label>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ wallpaperMode: 'none' })}
                      className={`text-[11px] ${settings.wallpaperMode === 'none' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      Solid Background
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {WALLPAPER_PRESETS.map((wp) => {
                      const isSelected = settings.wallpaperMode === 'preset' && settings.wallpaperPreset === wp.id;
                      return (
                        <button
                          key={wp.id}
                          type="button"
                          onClick={() => {
                            playClickSound(settings.soundEnabled);
                            onUpdateSettings({
                              wallpaperMode: 'preset',
                              wallpaperPreset: wp.id,
                            });
                          }}
                          className={`relative h-20 rounded-xl border overflow-hidden p-2.5 text-left transition-all ${
                            isSelected ? 'border-indigo-400 ring-2 ring-indigo-400/50' : 'border-white/10 hover:border-white/30'
                          }`}
                          style={wp.cssStyle}
                        >
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
                          <div className="relative z-10 flex flex-col justify-between h-full">
                            <span className="text-[11px] font-bold text-white drop-shadow-md">
                              {wp.name}
                            </span>
                            {isSelected && (
                              <span className="self-end p-1 rounded-full bg-indigo-500 text-white">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Wallpaper Upload (IndexedDB) */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                      Custom Wallpaper (IndexedDB)
                    </span>
                    {customWallpaperUrl && (
                      <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Upload a high-resolution photo (JPG, PNG, WebP). Saved securely in your browser&apos;s local IndexedDB.
                  </p>

                  {customWallpaperUrl ? (
                    <div className="space-y-2">
                      <div className="relative h-24 rounded-lg overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={customWallpaperUrl}
                          alt="Custom Wallpaper Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                          <span className="text-[11px] text-white font-mono truncate">
                            {customWallpaperFileName || 'custom-wallpaper.jpg'}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateSettings({ wallpaperMode: 'custom' })}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                            settings.wallpaperMode === 'custom'
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {settings.wallpaperMode === 'custom' ? 'Selected' : 'Use Uploaded'}
                        </button>

                        <button
                          type="button"
                          onClick={onRemoveCustomWallpaper}
                          className="py-1.5 px-3 rounded-lg text-xs font-medium border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-indigo-400 hover:bg-white/5 transition-all text-xs font-medium text-slate-300 flex flex-col items-center justify-center gap-1.5"
                      >
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span>{isUploading ? 'Compressing & Saving...' : 'Click to Upload Image (up to 15MB)'}</span>
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-[11px] text-rose-400 font-medium">{uploadError}</p>
                  )}
                </div>

                {/* Wallpaper Blur & Dimming Controls */}
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={currentTheme.classes.textSecondary}>Wallpaper Blur</span>
                      <span className="font-mono text-slate-400">{settings.wallpaperBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={1}
                      value={settings.wallpaperBlur}
                      onChange={(e) => onUpdateSettings({ wallpaperBlur: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={currentTheme.classes.textSecondary}>Wallpaper Dim / Darkness</span>
                      <span className="font-mono text-slate-400">{settings.wallpaperDim}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={85}
                      step={5}
                      value={settings.wallpaperDim}
                      onChange={(e) => onUpdateSettings({ wallpaperDim: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={currentTheme.classes.textSecondary}>Card Glass Opacity</span>
                      <span className="font-mono text-slate-400">{settings.cardGlassOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      step={5}
                      value={settings.cardGlassOpacity}
                      onChange={(e) => onUpdateSettings({ cardGlassOpacity: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. LAYOUT TAB */}
            {activeTab === 'layout' && (
              <div className="space-y-5">
                {/* Density */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${currentTheme.classes.textPrimary}`}>
                    Layout Spacing
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'comfortable' as const, label: 'Comfortable', desc: 'Spacious cards & generous gaps' },
                      { id: 'compact' as const, label: 'Compact', desc: 'High density for power users' },
                    ].map((item) => {
                      const isSelected = settings.layoutDensity === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            playClickSound(settings.soundEnabled);
                            onUpdateSettings({ layoutDensity: item.id });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-indigo-400 bg-white/5 ring-1 ring-indigo-400/40'
                              : 'border-white/5 hover:border-white/10 bg-black/20'
                          }`}
                        >
                          <span className={`block text-xs font-bold ${currentTheme.classes.textPrimary}`}>
                            {item.label}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section Visibility Toggles */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${currentTheme.classes.textPrimary}`}>
                    Visible Dashboard Elements
                  </label>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                    <div>
                      <span className={`block text-xs font-medium ${currentTheme.classes.textPrimary}`}>
                        Overview Statistics Cards
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Total, Active, Completed & Progress ring
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ showStats: !settings.showStats })}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        settings.showStats ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings.showStats ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                    <div>
                      <span className={`block text-xs font-medium ${currentTheme.classes.textPrimary}`}>
                        Greeting & Motivation Banner
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Dynamic time-of-day welcome message
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ showGreeting: !settings.showGreeting })}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        settings.showGreeting ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings.showGreeting ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="space-y-5">
                {/* Clock Format */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${currentTheme.classes.textPrimary}`}>
                    Clock Time Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '12h' as const, label: '12-Hour (e.g. 09:30 AM)' },
                      { id: '24h' as const, label: '24-Hour (e.g. 21:30)' },
                    ].map((fmt) => {
                      const isSelected = settings.clockFormat === fmt.id;
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => {
                            playClickSound(settings.soundEnabled);
                            onUpdateSettings({ clockFormat: fmt.id });
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-indigo-400 bg-white/5 text-white'
                              : 'border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Builder Name */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${currentTheme.classes.textPrimary}`}>
                    Builder Display Name
                  </label>
                  <input
                    type="text"
                    value={settings.userName}
                    onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                    placeholder="Enter your name"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none ${currentTheme.classes.inputBg} ${currentTheme.classes.inputBorder} ${currentTheme.classes.textPrimary}`}
                  />
                </div>

                {/* Audio Feedback */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                  <div>
                    <span className={`block text-xs font-medium ${currentTheme.classes.textPrimary}`}>
                      Synthetic Sound Chimes
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Pleasant Web Audio tone on task completion
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                      settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Reset Appearance Button */}
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onResetAppearance}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Appearance to Default</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-1.5">
                    Resets themes & wallpapers. Does NOT delete your tasks.
                  </p>
                </div>
              </div>
            )}

            {/* 4. DATA & BACKUP TAB */}
            {activeTab === 'data' && (
              <div className="space-y-5">
                {/* Local-first architecture note */}
                <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1">
                    <Shield className="w-4 h-4" />
                    <span>Local-First & 100% Private</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    RoxTasks saves all your data directly in your browser&apos;s localStorage and IndexedDB. There are no remote servers, no cloud tracking, and no external databases.
                  </p>
                  <p className="text-[10px] text-amber-300/80 mt-2 font-mono">
                    Note: If you clear your browser site data or cookies, local data will be erased. Use Export Backup regularly to keep safe copies!
                  </p>
                </div>

                {/* Export & Import */}
                <div className="space-y-3">
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${currentTheme.classes.textPrimary}`}>
                    Data Portability
                  </label>

                  <button
                    type="button"
                    onClick={onExportBackup}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Export Tasks Backup (.JSON)</span>
                  </button>

                  <div>
                    <input
                      ref={importInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => importInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileUp className="w-4 h-4 text-sky-400" />
                      <span>Import Backup (.JSON)</span>
                    </button>
                  </div>
                </div>

                {/* Clear All Tasks */}
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClearAllTasks}
                    className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Tasks</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-1.5">
                    Permanently deletes all tasks from this browser profile.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">RoxTasks v1.0.0</span>
            <span className="text-[11px] opacity-70">Crafted by Build Rox</span>
          </div>
        </div>
      </div>
    </div>
  );
};
