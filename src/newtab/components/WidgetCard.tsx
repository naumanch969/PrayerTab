import React from 'react';
import { Settings2, Trash2 } from 'lucide-react';
import type { UserSettings, WidgetId, WidgetLayout, WidgetDisplayMode } from '../../types';
import type { WidgetRuntimeData } from '../../widgets/types';
import { getSizeTier } from '../utils';
import { WIDGET_LOOKUP } from '../constants';
import { WidgetRenderer } from '../../widgets/WidgetRenderer';

interface WidgetCardProps {
    widgetId: WidgetId;
    isEditMode: boolean;
    layout: WidgetLayout;
    displayMode: WidgetDisplayMode;
    onDragStart: (widgetId: WidgetId, index: number, event: React.PointerEvent<HTMLElement>) => void;
    onResizeStart: (widgetId: WidgetId, index: number, event: React.PointerEvent<HTMLButtonElement>) => void;
    onRemove: (widgetId: WidgetId) => void;
    isActiveSettings: boolean;
    onToggleSettings: (widgetId: WidgetId) => void;
    onSetDisplayMode: (widgetId: WidgetId, mode: WidgetDisplayMode) => void;
    onEnterEditMode: () => void;
    settings: UserSettings;
    runtime: WidgetRuntimeData;
    index: number;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ widgetId, isEditMode, layout, displayMode, onDragStart, onResizeStart, onRemove, isActiveSettings, onToggleSettings, onSetDisplayMode, onEnterEditMode, settings, runtime, index }) => {
    const widget = WIDGET_LOOKUP[widgetId];
    const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    if (!widget) return null; // Safe guard against corrupt memory or unknown widgets

    const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
        if (!isEditMode) {
            longPressTimer.current = setTimeout(() => {
                onEnterEditMode();
            }, 600);
        }
        onDragStart(widgetId, index, event);
    };

    const handlePointerUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const sizeTier = getSizeTier(layout, displayMode);

    return (
        <article
            className={`canvas-widget ${isEditMode ? 'edit-mode' : ''} ${sizeTier}`}
            style={{ left: layout.x, top: layout.y, width: layout.w, height: layout.h }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <WidgetRenderer
                widgetId={widgetId}
                sizeTier={sizeTier}
                isEditMode={isEditMode}
                settings={settings}
                runtime={runtime}
            />

            {isEditMode && (
                <div className="canvas-widget-controls">
                    <button
                        className="canvas-widget-control-btn"
                        aria-label={`Settings for ${widget.name}`}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() => onToggleSettings(widgetId)}
                    >
                        <Settings2 size={12} strokeWidth={1.9} />
                    </button>
                    <button
                        className="canvas-widget-control-btn danger"
                        aria-label={`Remove ${widget.name}`}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            onRemove(widgetId);
                        }}
                    >
                        <Trash2 size={12} strokeWidth={2} />
                    </button>
                </div>
            )}

            {isEditMode && isActiveSettings && (
                <div className="canvas-widget-settings-popover" onPointerDown={(event) => event.stopPropagation()}>
                    <div className="canvas-widget-settings-title">Widget Settings</div>
                    <div className="canvas-widget-mode-row">
                        {(['auto', 'compact', 'expanded'] as WidgetDisplayMode[]).map((mode) => (
                            <button
                                key={mode}
                                className={`canvas-widget-mode-btn ${displayMode === mode ? 'active' : ''}`}
                                onClick={() => onSetDisplayMode(widgetId, mode)}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isEditMode && (
                <button
                    className="canvas-widget-resize"
                    onPointerDown={(event) => onResizeStart(widgetId, index, event)}
                    aria-label={`Resize ${widget.name}`}
                />
            )}
        </article>
    );
};
