import { useState, useRef, useEffect, useCallback } from 'react';
import type { WidgetId, WidgetLayout } from '../../types';
import type { InteractionState } from '../types';
import { clamp, snapToGrid } from '../utils';
import { MAX_WIDGET_H, MAX_WIDGET_W, MIN_WIDGET_H, MIN_WIDGET_W, WIDGET_SIZE_CONSTRAINTS } from '../constants';

export function useWidgetInteraction(isEditMode: boolean, initialLayouts: Partial<Record<WidgetId, WidgetLayout>>, onSaveLayouts: (layouts: Partial<Record<WidgetId, WidgetLayout>>) => void) {
    const [layoutDraft, setLayoutDraft] = useState<Partial<Record<WidgetId, WidgetLayout>>>(initialLayouts);
    const [activeInteraction, setActiveInteraction] = useState<{ widgetId: WidgetId; kind: 'drag' | 'resize' } | null>(null);
    const interactionRef = useRef<InteractionState | null>(null);
    const layoutDraftRef = useRef(layoutDraft);

    useEffect(() => {
        layoutDraftRef.current = layoutDraft;
    }, [layoutDraft]);

    useEffect(() => {
        setLayoutDraft(initialLayouts);
    }, [initialLayouts]);

    const startInteraction = useCallback((kind: 'drag' | 'resize', widgetId: WidgetId, event: React.PointerEvent, baseLayout: WidgetLayout) => {
        if (!isEditMode) return;

        const target = event.target as HTMLElement;
        if (kind === 'drag' && (
            target.closest('.canvas-widget-controls') ||
            target.closest('.canvas-widget-settings-popover') ||
            target.closest('.canvas-widget-resize')
        )) {
            return;
        }

        event.preventDefault();
        if (kind === 'resize') {
            event.stopPropagation();
        }
        event.currentTarget.setPointerCapture(event.pointerId);
        document.body.classList.add('is-canvas-interacting');

        interactionRef.current = {
            kind,
            pointerId: event.pointerId,
            widgetId,
            startX: event.clientX,
            startY: event.clientY,
            baseLayout,
        };
        setActiveInteraction({ widgetId, kind });
    }, [isEditMode]);

    useEffect(() => {
        if (!isEditMode) return;

        const onPointerMove = (event: PointerEvent) => {
            const interaction = interactionRef.current;
            if (!interaction) return;
            if (event.pointerId !== interaction.pointerId) return;

            const dx = event.clientX - interaction.startX;
            const dy = event.clientY - interaction.startY;

            setLayoutDraft((prev) => {
                const current = prev[interaction.widgetId] ?? interaction.baseLayout;

                if (interaction.kind === 'drag') {
                    const x = clamp(
                        snapToGrid(interaction.baseLayout.x + dx),
                        0,
                        Math.max(0, window.innerWidth - current.w - 10),
                    );
                    const y = clamp(
                        snapToGrid(interaction.baseLayout.y + dy),
                        0,
                        Math.max(0, window.innerHeight - current.h - 10),
                    );

                    return { ...prev, [interaction.widgetId]: { ...current, x, y } };
                }

                const constraints = WIDGET_SIZE_CONSTRAINTS[interaction.widgetId];
                const minW = constraints?.minW ?? MIN_WIDGET_W;
                const maxW = constraints?.maxW ?? MAX_WIDGET_W;
                const minH = constraints?.minH ?? MIN_WIDGET_H;
                const maxH = constraints?.maxH ?? MAX_WIDGET_H;

                let w = clamp(
                    snapToGrid(interaction.baseLayout.w + dx),
                    minW,
                    maxW,
                );
                let h = clamp(
                    snapToGrid(interaction.baseLayout.h + dy),
                    minH,
                    maxH,
                );

                const minAspect = constraints?.minAspect;
                const maxAspect = constraints?.maxAspect;
                if (minAspect || maxAspect) {
                    const ratio = w / Math.max(h, 1);
                    if (minAspect && ratio < minAspect) {
                        w = clamp(snapToGrid(h * minAspect), minW, maxW);
                    } else if (maxAspect && ratio > maxAspect) {
                        h = clamp(snapToGrid(w / maxAspect), minH, maxH);
                    }

                    if (minAspect) {
                        const minHeightForWidth = snapToGrid(w / minAspect);
                        h = Math.min(h, clamp(minHeightForWidth, minH, maxH));
                    }
                    if (maxAspect) {
                        const minWidthForHeight = snapToGrid(h * maxAspect);
                        w = Math.min(w, clamp(minWidthForHeight, minW, maxW));
                    }
                }

                return { ...prev, [interaction.widgetId]: { ...current, w, h } };
            });
        };

        const finishInteraction = (event: PointerEvent) => {
            const interaction = interactionRef.current;
            if (!interaction) return;
            if (event.pointerId !== interaction.pointerId) return;

            interactionRef.current = null;
            setActiveInteraction(null);
            document.body.classList.remove('is-canvas-interacting');

            // Note: We avoid auto-saving every minor drop if it causes too many rewrites.
            // For now, mirroring previous logic to persist.
            onSaveLayouts(layoutDraftRef.current);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', finishInteraction);
        window.addEventListener('pointercancel', finishInteraction);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', finishInteraction);
            window.removeEventListener('pointercancel', finishInteraction);
            document.body.classList.remove('is-canvas-interacting');
            setActiveInteraction(null);
        };
    }, [isEditMode, onSaveLayouts]);

    return {
        layoutDraft,
        setLayoutDraft,
        startInteraction,
        activeInteraction,
    };
}
