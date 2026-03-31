import { BACKGROUNDS, DEFAULT_WIDGET_H, DEFAULT_WIDGET_W, GRID_SIZE, WIDGET_DEFAULT_SIZES, WIDGET_SIZE_CONSTRAINTS } from './constants';
import type { WidgetDisplayMode, WidgetId, WidgetLayout } from '../types';

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

export function defaultLayoutForIndex(index: number, widgetId?: WidgetId): WidgetLayout {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const defaultSize = widgetId ? WIDGET_DEFAULT_SIZES[widgetId] : null;
    return {
        x: 34 + col * 258,
        y: 92 + row * 148,
        w: defaultSize?.w ?? DEFAULT_WIDGET_W,
        h: defaultSize?.h ?? DEFAULT_WIDGET_H,
    };
}

export function normalizeLayout(widgetId: WidgetId, layout: WidgetLayout): WidgetLayout {
    const constraints = WIDGET_SIZE_CONSTRAINTS[widgetId];
    if (!constraints) return layout;

    let w = clamp(layout.w, constraints.minW, constraints.maxW);
    let h = clamp(layout.h, constraints.minH, constraints.maxH);

    if (constraints.minAspect || constraints.maxAspect) {
        const ratio = w / Math.max(h, 1);
        if (constraints.minAspect && ratio < constraints.minAspect) {
            w = clamp(snapToGrid(h * constraints.minAspect), constraints.minW, constraints.maxW);
        }
        if (constraints.maxAspect && ratio > constraints.maxAspect) {
            h = clamp(snapToGrid(w / constraints.maxAspect), constraints.minH, constraints.maxH);
        }
    }

    return { ...layout, w, h };
}

export function getSizeTier(layout: WidgetLayout, mode: WidgetDisplayMode): 'small' | 'medium' | 'large' {
    if (mode === 'compact') return 'small';
    if (mode === 'expanded') return 'large';

    const area = layout.w * layout.h;
    if (area < 28000) return 'small';
    if (area < 50000) return 'medium';
    return 'large';
}
