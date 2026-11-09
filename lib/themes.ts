import { ThemeId, WallpaperPresetId } from '@/types/todo';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  colors: {
    bgPage: string;
    bgSidebar: string;
    bgColumn: string;
    bgCard: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accentBtn: string;
    accentText: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'minimal-light': {
    id: 'minimal-light',
    name: 'Minimal Light',
    isDark: false,
    colors: {
      bgPage: 'bg-[#FAFBFC]',
      bgSidebar: 'bg-[#FFFFFF]',
      bgColumn: 'bg-[#F4F5F7]',
      bgCard: 'bg-[#FFFFFF]',
      border: 'border-slate-200/80',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      accentBtn: 'bg-slate-900 text-white hover:bg-slate-800',
      accentText: 'text-slate-900',
    },
  },
  'royal-obsidian': {
    id: 'royal-obsidian',
    name: 'Royal Obsidian',
    isDark: true,
    colors: {
      bgPage: 'bg-[#090A0F]',
      bgSidebar: 'bg-[#0E1118]',
      bgColumn: 'bg-[#141822]',
      bgCard: 'bg-[#1A1F2C]',
      border: 'border-slate-800',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      accentBtn: 'bg-white text-slate-950 hover:bg-slate-200',
      accentText: 'text-white',
    },
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    isDark: true,
    colors: {
      bgPage: 'bg-[#05150F]',
      bgSidebar: 'bg-[#081F17]',
      bgColumn: 'bg-[#0E2E23]',
      bgCard: 'bg-[#153D30]',
      border: 'border-emerald-900/60',
      textPrimary: 'text-emerald-50',
      textSecondary: 'text-emerald-200',
      textMuted: 'text-emerald-400/70',
      accentBtn: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
      accentText: 'text-emerald-400',
    },
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    isDark: true,
    colors: {
      bgPage: 'bg-[#071124]',
      bgSidebar: 'bg-[#0A1833]',
      bgColumn: 'bg-[#0F234A]',
      bgCard: 'bg-[#152E5E]',
      border: 'border-blue-900/60',
      textPrimary: 'text-sky-50',
      textSecondary: 'text-sky-200',
      textMuted: 'text-sky-400/70',
      accentBtn: 'bg-sky-500 text-slate-950 hover:bg-sky-400',
      accentText: 'text-sky-400',
    },
  },
  'peach-cream': {
    id: 'peach-cream',
    name: 'Peach Cream',
    isDark: false,
    colors: {
      bgPage: 'bg-[#FFF7ED]',
      bgSidebar: 'bg-[#FFFFFF]',
      bgColumn: 'bg-[#FFEDD5]/60',
      bgCard: 'bg-[#FFFFFF]',
      border: 'border-orange-200/80',
      textPrimary: 'text-amber-950',
      textSecondary: 'text-amber-800',
      textMuted: 'text-amber-600/70',
      accentBtn: 'bg-amber-900 text-white hover:bg-amber-800',
      accentText: 'text-amber-900',
    },
  },
};

export const WALLPAPER_PRESETS: { id: WallpaperPresetId; name: string; style: React.CSSProperties }[] = [
  {
    id: 'minimal-white',
    name: 'Minimal White',
    style: {
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    },
  },
  {
    id: 'dark-graphite',
    name: 'Dark Graphite',
    style: {
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.05) 0%, transparent 70%), linear-gradient(180deg, #090A0F 0%, #12151D 100%)',
      backgroundAttachment: 'fixed',
    },
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    style: {
      backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.12) 0%, transparent 60%), linear-gradient(180deg, #05150F 0%, #082118 100%)',
      backgroundAttachment: 'fixed',
    },
  },
  {
    id: 'ocean-gradient',
    name: 'Ocean Gradient',
    style: {
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(56,189,248,0.12) 0%, transparent 60%), linear-gradient(180deg, #071124 0%, #0C1E40 100%)',
      backgroundAttachment: 'fixed',
    },
  },
  {
    id: 'peach-sunrise',
    name: 'Peach Sunrise',
    style: {
      backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(251,146,60,0.14) 0%, transparent 60%), linear-gradient(180deg, #FFF7ED 0%, #FED7AA 100%)',
      backgroundAttachment: 'fixed',
    },
  },
];
