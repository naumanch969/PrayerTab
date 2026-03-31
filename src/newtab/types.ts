import type { WidgetId, WidgetLayout } from '../types';

export type WidgetNavId = 'salah' | 'reflection' | 'focus' | 'utility';

export type InteractionState = {
    kind: 'drag' | 'resize';
    pointerId: number;
    widgetId: WidgetId;
    startX: number;
    startY: number;
    baseLayout: WidgetLayout;
};
