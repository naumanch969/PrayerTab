import { BACKGROUNDS, DEFAULT_WIDGET_H, DEFAULT_WIDGET_W, GRID_SIZE } from './constants';
import type { WidgetDisplayMode, WidgetLayout } from '../types';

export function getDailyBackground(date: Date): string {
    const dayOfYear = Math.floor(
        (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
    );
    return BACKGROUNDS[dayOfYear % BACKGROUNDS.length];
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function snapToGrid(value: number): number {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function defaultLayoutForIndex(index: number): WidgetLayout {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
        x: 34 + col * 258,
        y: 92 + row * 148,
        w: DEFAULT_WIDGET_W,
        h: DEFAULT_WIDGET_H,
    };
}

export function getSizeTier(layout: WidgetLayout, mode: WidgetDisplayMode): 'small' | 'medium' | 'large' {
    if (mode === 'compact') return 'small';
    if (mode === 'expanded') return 'large';

    const area = layout.w * layout.h;
    if (area < 28000) return 'small';
    if (area < 50000) return 'medium';
    return 'large';
}
