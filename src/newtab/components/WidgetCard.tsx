import React from 'react';
import { Settings2, Trash2 } from 'lucide-react';
import type { UserSettings, WidgetId, WidgetLayout, WidgetDisplayMode } from '../../types';
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
    settings: UserSettings;
    index: number;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ widgetId, isEditMode, layout, displayMode, onDragStart, onResizeStart, onRemove, isActiveSettings, onToggleSettings, onSetDisplayMode, settings, index }) => {
    const widget = WIDGET_LOOKUP[widgetId];
    if (!widget) return null; // Safe guard against corrupt memory or unknown widgets

    const sizeTier = getSizeTier(layout, displayMode);

    return (
        <article
            className={`canvas-widget ${isEditMode ? 'edit-mode' : ''} ${sizeTier}`}
            style={{ left: layout.x, top: layout.y, width: layout.w, height: layout.h }}
            onPointerDown={(event) => onDragStart(widgetId, index, event)}
        >
            <div className="canvas-widget-title">{widget.name}</div>
            <WidgetRenderer
                widgetId={widgetId}
                sizeTier={sizeTier}
                isEditMode={isEditMode}
                settings={settings}
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
