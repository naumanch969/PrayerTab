import type { LayoutPreset, WidgetId, WidgetLayout } from '../types';
import { WIDGET_DEFAULT_SIZES } from './constants';

export const SYSTEM_PRESETS: LayoutPreset[] = [
    {
        id: 'preset-minimal',
        name: 'Minimal',
        widgets: ['clock', 'hijri-date'],
        layouts: {
            clock: { x: 50, y: 120, w: 324, h: 204 },
            'hijri-date': { x: 50, y: 340, w: 288, h: 192 },
        },
        preferences: {
            clock: { displayMode: 'auto' },
            'hijri-date': { displayMode: 'compact' },
        },
    },
    {
        id: 'preset-balanced',
        name: 'Balanced',
        widgets: ['clock', 'next-prayer', 'hijri-date', 'daily-ayah'],
        layouts: {
            clock: { x: 40, y: 80, w: 324, h: 204 },
            'next-prayer': { x: 40, y: 300, w: 336, h: 228 },
            'hijri-date': { x: 40, y: 544, w: 288, h: 192 },
            'daily-ayah': { x: 440, y: 80, w: 432, h: 552 },
        },
        preferences: {
            clock: { displayMode: 'auto' },
            'next-prayer': { displayMode: 'auto' },
            'hijri-date': { displayMode: 'compact' },
            'daily-ayah': { displayMode: 'auto' },
        },
    },
    {
        id: 'preset-full',
        name: 'Full Dashboard',
        widgets: ['prayer-times', 'next-prayer', 'clock', 'daily-ayah', 'dhikr-counter', 'focus-task', 'hijri-date'],
        layouts: {
            'prayer-times': { x: 40, y: 80, w: 372, h: 300 },
            'next-prayer': { x: 40, y: 396, w: 336, h: 228 },
            'hijri-date': { x: 40, y: 640, w: 288, h: 192 },
            clock: { x: 440, y: 80, w: 324, h: 204 },
            'daily-ayah': { x: 800, y: 80, w: 432, h: 552 },
            'dhikr-counter': { x: 440, y: 304, w: 252, h: 240 },
            'focus-task': { x: 440, y: 560, w: 336, h: 216 },
        },
        preferences: {
            'prayer-times': { displayMode: 'auto' },
            'next-prayer': { displayMode: 'auto' },
            'hijri-date': { displayMode: 'compact' },
            clock: { displayMode: 'auto' },
            'daily-ayah': { displayMode: 'auto' },
            'dhikr-counter': { displayMode: 'auto' },
            'focus-task': { displayMode: 'auto' },
        },
    },
];

export function getWidgetDefaultSize(widgetId: WidgetId): WidgetLayout {
    const size = WIDGET_DEFAULT_SIZES[widgetId];
    return {
        x: 0,
        y: 0,
        w: size?.w ?? 240,
        h: size?.h ?? 120,
    };
}
