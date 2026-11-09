import { ThemeId, AccentColor, WallpaperPresetId } from '@/types/todo';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
  previewColors: string[];
  classes: {
    bgPage: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    cardBg: string;
    cardBorder: string;
    cardHoverBorder: string;
    inputBg: string;
    inputBorder: string;
    activeItemBg: string;
    subtleBg: string;
    progressTrack: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'royal-obsidian': {
    id: 'royal-obsidian',
    name: 'Royal Obsidian',
    description: 'Deep obsidian, graphite grey, platinum silver, and subtle metallic sheen.',
    isDark: true,
    previewColors: ['#090a0f', '#161922', '#222834', '#e2e8f0'],
    classes: {
      bgPage: 'bg-[#090a0f]',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      cardBg: 'bg-[#12151c]/90',
      cardBorder: 'border-slate-800/80',
      cardHoverBorder: 'hover:border-slate-700',
      inputBg: 'bg-[#0d1017]/90',
      inputBorder: 'border-slate-800',
      activeItemBg: 'bg-slate-800/50',
      subtleBg: 'bg-slate-900/60',
      progressTrack: 'bg-slate-800/60',
    },
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Deep emerald, rich pine, moss accents, and ivory typography.',
    isDark: true,
    previewColors: ['#05140f', '#0b261d', '#134032', '#f0fdf4'],
    classes: {
      bgPage: 'bg-[#05140f]',
      textPrimary: 'text-emerald-50',
      textSecondary: 'text-emerald-200/90',
      textMuted: 'text-emerald-400/70',
      cardBg: 'bg-[#0a231b]/90',
      cardBorder: 'border-emerald-900/70',
      cardHoverBorder: 'hover:border-emerald-700/80',
      inputBg: 'bg-[#061812]/90',
      inputBorder: 'border-emerald-900/80',
      activeItemBg: 'bg-emerald-950/60',
      subtleBg: 'bg-emerald-900/40',
      progressTrack: 'bg-emerald-950/80',
    },
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Abyssal navy, sapphire slate, crisp silver, and deep marine clarity.',
    isDark: true,
    previewColors: ['#060e1d', '#0c1b35', '#16315c', '#f8fafc'],
    classes: {
      bgPage: 'bg-[#060e1d]',
      textPrimary: 'text-sky-50',
      textSecondary: 'text-sky-200/90',
      textMuted: 'text-sky-400/70',
      cardBg: 'bg-[#0d1c38]/90',
      cardBorder: 'border-blue-900/70',
      cardHoverBorder: 'hover:border-sky-700/70',
      inputBg: 'bg-[#081326]/90',
      inputBorder: 'border-blue-900/80',
      activeItemBg: 'bg-blue-950/60',
      subtleBg: 'bg-blue-900/40',
      progressTrack: 'bg-blue-950/80',
    },
  },
  'peach-cream': {
    id: 'peach-cream',
    name: 'Peach Cream',
    description: 'Warm espresso charcoal, velvet amber glow, soft cream, and terracotta tones.',
    isDark: true,
    previewColors: ['#140f0d', '#241a16', '#3b2a24', '#ffedd5'],
    classes: {
      bgPage: 'bg-[#140f0d]',
      textPrimary: 'text-orange-50',
      textSecondary: 'text-orange-200/90',
      textMuted: 'text-orange-300/60',
      cardBg: 'bg-[#211713]/90',
      cardBorder: 'border-orange-900/60',
      cardHoverBorder: 'hover:border-orange-700/60',
      inputBg: 'bg-[#18110e]/90',
      inputBorder: 'border-orange-900/70',
      activeItemBg: 'bg-orange-950/60',
      subtleBg: 'bg-orange-900/30',
      progressTrack: 'bg-stone-900/80',
    },
  },
  'classic-light': {
    id: 'classic-light',
    name: 'Classic Light',
    description: 'Pure porcelain white, dove grey surfaces, sharp graphite contrast.',
    isDark: false,
    previewColors: ['#f8fafc', '#ffffff', '#e2e8f0', '#0f172a'],
    classes: {
      bgPage: 'bg-slate-50',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      cardBg: 'bg-white/95',
      cardBorder: 'border-slate-200',
      cardHoverBorder: 'hover:border-slate-300',
      inputBg: 'bg-slate-50/90',
      inputBorder: 'border-slate-200',
      activeItemBg: 'bg-slate-100',
      subtleBg: 'bg-slate-100/80',
      progressTrack: 'bg-slate-200',
    },
  },
};

export interface AccentColorConfig {
  id: AccentColor;
  name: string;
  hex: string;
  badgeClass: string;
  buttonClass: string;
  borderClass: string;
  ringClass: string;
  textClass: string;
}

export const ACCENT_COLORS: Record<AccentColor, AccentColorConfig> = {
  titanium: {
    id: 'titanium',
    name: 'Titanium',
    hex: '#94a3b8',
    badgeClass: 'bg-slate-700/40 text-slate-200 border-slate-600/50',
    buttonClass: 'bg-slate-200 text-slate-950 hover:bg-white',
    borderClass: 'border-slate-400',
    ringClass: 'focus:ring-slate-400',
    textClass: 'text-slate-300',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    hex: '#10b981',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    buttonClass: 'bg-emerald-500 text-white hover:bg-emerald-400',
    borderClass: 'border-emerald-500',
    ringClass: 'focus:ring-emerald-400',
    textClass: 'text-emerald-400',
  },
  azure: {
    id: 'azure',
    name: 'Azure',
    hex: '#3b82f6',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    buttonClass: 'bg-blue-600 text-white hover:bg-blue-500',
    borderClass: 'border-blue-500',
    ringClass: 'focus:ring-blue-400',
    textClass: 'text-blue-400',
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    hex: '#f59e0b',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    buttonClass: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
    borderClass: 'border-amber-500',
    ringClass: 'focus:ring-amber-400',
    textClass: 'text-amber-400',
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    hex: '#f43f5e',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    buttonClass: 'bg-rose-500 text-white hover:bg-rose-400',
    borderClass: 'border-rose-500',
    ringClass: 'focus:ring-rose-400',
    textClass: 'text-rose-400',
  },
  violet: {
    id: 'violet',
    name: 'Violet',
    hex: '#8b5cf6',
    badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    buttonClass: 'bg-violet-600 text-white hover:bg-violet-500',
    borderClass: 'border-violet-500',
    ringClass: 'focus:ring-violet-400',
    textClass: 'text-violet-400',
  },
};

export interface WallpaperPreset {
  id: WallpaperPresetId;
  name: string;
  description: string;
  cssStyle: React.CSSProperties;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'dark-mountains',
    name: 'Dark Mountains',
    description: 'Polygonal mountain silhouettes fading into deep starlight gradient.',
    cssStyle: {
      backgroundImage: `
        radial-gradient(circle at 50% 18%, rgba(148, 163, 184, 0.12) 0%, transparent 60%),
        linear-gradient(180deg, #05070d 0%, #0d121f 45%, #182032 75%, #080b12 100%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'midnight-gradient',
    name: 'Midnight Gradient',
    description: 'Deep cosmic obsidian with midnight violet and indigo radial meshes.',
    cssStyle: {
      backgroundImage: `
        radial-gradient(at 10% 20%, rgba(124, 58, 237, 0.15) 0px, transparent 50%),
        radial-gradient(at 85% 75%, rgba(59, 130, 246, 0.14) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(15, 23, 42, 0.8) 0px, transparent 100%),
        linear-gradient(135deg, #090a0f 0%, #0e111a 100%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    description: 'Atmospheric deep emerald mist with radial pine glows.',
    cssStyle: {
      backgroundImage: `
        radial-gradient(circle at 75% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 55%),
        radial-gradient(circle at 20% 80%, rgba(5, 150, 105, 0.1) 0%, transparent 60%),
        linear-gradient(160deg, #030d09 0%, #061a12 50%, #03100a 100%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    description: 'Bioluminescent deep oceanic waves with sapphire clarity.',
    cssStyle: {
      backgroundImage: `
        radial-gradient(circle at 30% 15%, rgba(56, 189, 248, 0.13) 0%, transparent 50%),
        radial-gradient(circle at 70% 85%, rgba(37, 99, 235, 0.12) 0%, transparent 60%),
        linear-gradient(180deg, #030814 0%, #06132b 50%, #020712 100%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'peach-sunrise',
    name: 'Peach Sunrise',
    description: 'Warm sunrise horizon glow over obsidian and velvet dusk.',
    cssStyle: {
      backgroundImage: `
        radial-gradient(circle at 50% 10%, rgba(251, 146, 60, 0.16) 0%, transparent 55%),
        radial-gradient(circle at 80% 90%, rgba(244, 63, 94, 0.1) 0%, transparent 60%),
        linear-gradient(150deg, #160e0a 0%, #20130d 50%, #120b08 100%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'minimal-graphite',
    name: 'Minimal Graphite',
    description: 'Clean architectural subtle grid with soft graphite radial spotlight.',
    cssStyle: {
      backgroundImage: `
        radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(180deg, #0a0b0e 0%, #111318 100%)
      `,
      backgroundSize: '100% 100%, 36px 36px, 36px 36px, 100% 100%',
      backgroundAttachment: 'fixed',
    },
  },
];
