import type React from 'react';
import type { UserSettings } from '../types';

export const getBackgroundStyle = (settings: UserSettings | null | undefined, defaultBg: string): React.CSSProperties => {
  const source = settings?.backgroundSource;
  const backgroundValue = settings?.background;

  if (source === 'solid' && backgroundValue) {
    return { backgroundColor: backgroundValue };
  }

  if (source === 'gradient' && backgroundValue) {
    return { backgroundImage: backgroundValue };
  }

  const urlToUse = backgroundValue || defaultBg;
  return { backgroundImage: `url(${urlToUse})` };
};

export const getThemeVariables = (settings: UserSettings): React.CSSProperties => {
  const accent = settings.themeAccent || '#d4a843';
  return {
    '--theme-accent': accent,
    '--gold': accent,
    '--gold-text': `color-mix(in srgb, ${accent} 68%, white)`,
    '--gold-dim': `color-mix(in srgb, ${accent} 15%, transparent)`,
    '--gold-glow': `color-mix(in srgb, ${accent} 33%, transparent)`,
  } as React.CSSProperties;
};
