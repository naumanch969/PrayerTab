import { RefreshCcw, Image as ImageIcon, Link as LinkIcon, Palette, Paintbrush, UploadCloud } from 'lucide-react';
import type { CalculationMethod, UserSettings } from '../../types';
import { BACKGROUNDS } from '../../newtab/constants';

export const METHODS: { value: CalculationMethod; label: string }[] = [
  { value: 'MWL', label: 'Muslim World League' },
  { value: 'ISNA', label: 'ISNA' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Makkah', label: 'Umm al-Qura (Makkah)' },
  { value: 'Karachi', label: 'Karachi' },
  { value: 'Tehran', label: 'Tehran' },
  { value: 'Shia', label: 'Shia (Leva)' },
];

export const BG_SIDEBAR_ITEMS = [
  { id: 'collections', label: 'Collections', icon: RefreshCcw },
  { id: 'search', label: 'Image Search', icon: ImageIcon },
  { id: 'url', label: 'Image URL', icon: LinkIcon },
  { id: 'solid', label: 'Solid Color', icon: Palette },
  { id: 'gradient', label: 'Gradient', icon: Paintbrush },
  { id: 'upload', label: 'Upload Local', icon: UploadCloud },
] as const;

export const MOCK_CATEGORIES = [
  {
    name: 'All',
    items: BACKGROUNDS.map((url, i) => ({ name: `Preset ${i + 1}`, url })),
  },
] as const;

export const SOLID_COLORS = [
  '#0a0805', '#121212', '#1a1f2e', '#2d3748', '#2c3e50',
  '#0a192f', '#192734', '#3e2723', '#2e3b32', '#4a4036',
] as const;

export const GRADIENTS = [
  'linear-gradient(135deg, #0a0805 0%, #1a1f2e 100%)',
  'radial-gradient(circle at top right, #374151, #111827)',
  'linear-gradient(to bottom, #2c3e50, #000000)',
  'linear-gradient(45deg, #1c1c1c, #3e2723)',
  'linear-gradient(160deg, #1f2937 0%, #000000 100%)',
  'radial-gradient(circle at center, #2d3748, #000000)',
] as const;

export const HEX_COLOR_PATTERN = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

export const getInitialSolidColor = (settings: UserSettings): string => {
  if (settings.backgroundSource === 'solid' && settings.background && HEX_COLOR_PATTERN.test(settings.background)) {
    return settings.background;
  }
  return '#0a0805';
};

export const getInitialGradientColors = (settings: UserSettings): { start: string; end: string } => {
  const fallback = { start: '#0a0805', end: '#1a1f2e' };
  if (settings.backgroundSource !== 'gradient' || !settings.background) {
    return fallback;
  }

  const matches = settings.background.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
  if (!matches || matches.length < 2) {
    return fallback;
  }

  return { start: matches[0], end: matches[1] };
};
