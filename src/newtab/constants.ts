import {
    BookOpen, CalendarDays, Clock3, CloudSun, Compass, FileText, 
    GraduationCap, Grid2x2, Info, MessageCircle, Palette, Quote, 
    Settings2, Sparkles, Target, Wrench
} from 'lucide-react';
import type { WidgetId } from '../types';
import type { WidgetNavId } from './types';
import { LucideIcon } from 'lucide-react';

export interface WidgetSizeConstraint {
    minW: number;
    minH: number;
    maxW: number;
    maxH: number;
    minAspect?: number;
    maxAspect?: number;
}

export interface WidgetDefaultSize {
    w: number;
    h: number;
}

export const BACKGROUNDS = [
    'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1920&q=80',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1920&q=80',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1920&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1920&q=80',
    'https://images.unsplash.com/photo-1559329373-916f3239e5c8?w=1920&q=80',
];

export const GRID_SIZE = 12;
export const DEFAULT_WIDGET_W = 230;
export const DEFAULT_WIDGET_H = 120;
export const MIN_WIDGET_W = 168;
export const MIN_WIDGET_H = 96;
export const MAX_WIDGET_W = 420;
export const MAX_WIDGET_H = 260;

export const WIDGET_SIZE_CONSTRAINTS: Record<WidgetId, WidgetSizeConstraint> = {
    'prayer-times': { minW: 336, minH: 264, maxW: 620, maxH: 460 },
    'next-prayer': { minW: 288, minH: 192, maxW: 520, maxH: 360 },
    'hijri-date': { minW: 252, minH: 168, maxW: 460, maxH: 300 },
    clock: { minW: 264, minH: 180, maxW: 520, maxH: 340 },
    'daily-ayah': { minW: 300, minH: 220, maxW: 4000, maxH: 4000, minAspect: 0.62, maxAspect: 1.6 },
    'focus-task': { minW: 288, minH: 180, maxW: 560, maxH: 360 },
    'dhikr-counter': { minW: 228, minH: 192, maxW: 380, maxH: 320 },
    'prayer-streak': { minW: 288, minH: 192, maxW: 520, maxH: 360 },
    'qibla-compass': { minW: 288, minH: 192, maxW: 520, maxH: 360 },
    weather: { minW: 288, minH: 180, maxW: 520, maxH: 340 },
    tasbeeh: { minW: 324, minH: 204, maxW: 580, maxH: 420 },
    'ramadan-countdown': { minW: 324, minH: 192, maxW: 640, maxH: 420 },
    bookmarks: { minW: 312, minH: 192, maxW: 620, maxH: 420 },
    note: { minW: 312, minH: 216, maxW: 620, maxH: 460 },
};

export const WIDGET_DEFAULT_SIZES: Record<WidgetId, WidgetDefaultSize> = {
    'prayer-times': { w: 372, h: 300 },
    'next-prayer': { w: 336, h: 228 },
    'hijri-date': { w: 288, h: 192 },
    clock: { w: 324, h: 204 },
    'daily-ayah': { w: 432, h: 552 },
    'focus-task': { w: 360, h: 216 },
    'dhikr-counter': { w: 252, h: 240 },
    'prayer-streak': { w: 336, h: 228 },
    'qibla-compass': { w: 336, h: 216 },
    weather: { w: 324, h: 204 },
    tasbeeh: { w: 384, h: 240 },
    'ramadan-countdown': { w: 432, h: 240 },
    bookmarks: { w: 384, h: 240 },
    note: { w: 384, h: 264 },
};

export const WIDGET_NAV: { id: WidgetNavId; label: string; hint: string; icon: LucideIcon }[] = [
    { id: 'salah', label: 'Salah', hint: 'Times and direction', icon: Compass },
    { id: 'reflection', label: 'Reflection', hint: 'Quran and dhikr', icon: BookOpen },
    { id: 'focus', label: 'Focus', hint: 'Intent and rhythm', icon: Target },
    { id: 'utility', label: 'Utility', hint: 'Tools and links', icon: Wrench },
];

export const SETTINGS_NAV: { id: string; label: string; icon: LucideIcon }[] = [
    { id: 'background', label: 'Background', icon: Sparkles },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings2 },
    { id: 'about', label: 'About', icon: Info },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle },
];

export const WIDGET_LIBRARY: { id: WidgetId; name: string; description: string; preview: string }[] = [
    { id: 'prayer-times', name: 'Prayer Times', description: 'Daily salah times with current/next state.', preview: 'Fajr · Dhuhr · Asr' },
    { id: 'next-prayer', name: 'Next Prayer Countdown', description: 'Live countdown until the upcoming prayer.', preview: 'Maghrib in 01:28:12' },
    { id: 'hijri-date', name: 'Hijri Date', description: 'Current Hijri date at a glance.', preview: '20 Ramadan 1447' },
    { id: 'clock', name: 'Clock', description: 'Large digital time display.', preview: '08:30 PM' },
    { id: 'daily-ayah', name: 'Daily Ayah', description: 'A rotating ayah with translation.', preview: 'Quran 2:286' },
    { id: 'focus-task', name: 'Focus Task', description: 'Single daily intention entry.', preview: 'Today: Deep work' },
    { id: 'dhikr-counter', name: 'Dhikr Counter', description: 'Tap counter with 33-cycle flow.', preview: 'Subhanallah · 18/33' },
    { id: 'prayer-streak', name: 'Prayer Streak', description: 'Track daily consistency.', preview: 'Streak: 5 days' },
    { id: 'qibla-compass', name: 'Qibla Compass', description: 'Direction guidance toward Makkah.', preview: 'Qibla 287°' },
    { id: 'weather', name: 'Weather', description: 'Local weather snapshot.', preview: '23°C · Clear' },
    { id: 'tasbeeh', name: 'Tasbeeh', description: 'Tasbeeh cycle panel.', preview: 'Alhamdulillah' },
    { id: 'ramadan-countdown', name: 'Ramadan Countdown', description: 'Countdown to Ramadan / Iftar mode.', preview: 'Iftar in 00:48:30' },
    { id: 'bookmarks', name: 'Bookmarks', description: 'Quick links for your daily sites.', preview: '3 quick links' },
    { id: 'note', name: 'Note', description: 'Simple text note panel.', preview: 'Write reflection...' },
];

export const WIDGET_LOOKUP = Object.fromEntries(
    WIDGET_LIBRARY.map((widget) => [widget.id, widget]),
) as Record<WidgetId, (typeof WIDGET_LIBRARY)[number]>;

export const NAV_WIDGETS: Record<WidgetNavId, WidgetId[]> = {
    salah: ['prayer-times', 'next-prayer', 'hijri-date', 'qibla-compass', 'ramadan-countdown'],
    reflection: ['daily-ayah', 'dhikr-counter', 'tasbeeh'],
    focus: ['focus-task', 'prayer-streak', 'clock'],
    utility: ['weather', 'bookmarks', 'note'],
};
