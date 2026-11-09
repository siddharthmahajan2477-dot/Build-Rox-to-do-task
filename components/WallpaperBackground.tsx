'use client';

import React, { useMemo } from 'react';
import { UserSettings } from '@/types/todo';
import { THEMES, WALLPAPER_PRESETS } from '@/lib/themes';

interface WallpaperBackgroundProps {
  settings: UserSettings;
  customWallpaperUrl: string | null;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  settings,
  customWallpaperUrl,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES['royal-obsidian'];

  const presetStyle = useMemo(() => {
    if (settings.wallpaperMode === 'preset') {
      const found = WALLPAPER_PRESETS.find((p) => p.id === settings.wallpaperPreset);
      return found?.cssStyle || WALLPAPER_PRESETS[0].cssStyle;
    }
    return {};
  }, [settings.wallpaperMode, settings.wallpaperPreset]);

  const customStyle: React.CSSProperties = useMemo(() => {
    if (settings.wallpaperMode === 'custom' && customWallpaperUrl) {
      return {
        backgroundImage: `url("${customWallpaperUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      };
    }
    return {};
  }, [settings.wallpaperMode, customWallpaperUrl]);

  const activeStyle = settings.wallpaperMode === 'custom' ? customStyle : presetStyle;

  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
      {/* Base Theme Color */}
      <div className={`absolute inset-0 transition-colors duration-300 ${currentTheme.classes.bgPage}`} />

      {/* Wallpaper Layer */}
      {settings.wallpaperMode !== 'none' && (
        <div
          className="absolute inset-0 transition-all duration-300 transform scale-105"
          style={{
            ...activeStyle,
            filter: settings.wallpaperBlur > 0 ? `blur(${settings.wallpaperBlur}px)` : 'none',
          }}
        />
      )}

      {/* Dim / Scrim Overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{
          opacity: (settings.wallpaperDim || 0) / 100,
        }}
      />
    </div>
  );
};
