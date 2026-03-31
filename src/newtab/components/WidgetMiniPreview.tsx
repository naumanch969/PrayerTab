import React from 'react';
import { BookOpen, CalendarDays, CheckSquare, Clock3, CloudSun, Compass, FileText, Quote, StickyNote } from 'lucide-react';
import type { WidgetId } from '../../types';

export const WidgetMiniPreview: React.FC<{ widgetId: WidgetId }> = ({ widgetId }) => {
    switch (widgetId) {
        case 'prayer-times':
            return (
                <div className="widget-mini widget-mini-prayers">
                    <div className="widget-mini-line" />
                    <div className="widget-mini-line" />
                    <div className="widget-mini-line" />
                </div>
            );
        case 'next-prayer':
        case 'ramadan-countdown':
            return (
                <div className="widget-mini widget-mini-countdown">
                    <div className="widget-mini-seg" />
                    <div className="widget-mini-seg" />
                    <div className="widget-mini-seg" />
                </div>
            );
        case 'hijri-date':
            return (
                <div className="widget-mini widget-mini-date">
                    <div className="widget-mini-calendar-top" />
                    <div className="widget-mini-calendar-grid" />
                </div>
            );
        case 'clock':
            return (
                <div className="widget-mini widget-mini-clock">
                    <div className="widget-mini-clock-face">
                        <span className="widget-mini-hand short" />
                        <span className="widget-mini-hand long" />
                    </div>
                </div>
            );
        case 'daily-ayah':
            return (
                <div className="widget-mini widget-mini-quote">
                    <Quote size={14} strokeWidth={2} />
                    <div className="widget-mini-quote-lines"><span /><span /><span /></div>
                </div>
            );
        case 'focus-task':
            return (
                <div className="widget-mini widget-mini-task">
                    <div className="widget-mini-task-row"><CheckSquare size={14} strokeWidth={2} /><span className="widget-mini-task-line" /></div>
                    <div className="widget-mini-task-row"><CheckSquare size={14} strokeWidth={2} /><span className="widget-mini-task-line" /></div>
                </div>
            );
        case 'dhikr-counter':
            return (
                <div className="widget-mini widget-mini-counter">
                    <div className="widget-mini-counter-ring">18</div>
                </div>
            );
        case 'prayer-streak':
            return (
                <div className="widget-mini widget-mini-streak">
                    <div className="widget-mini-streak-dots">
                        <span /><span /><span /><span /><span className="active" /><span className="active" /><span className="active" />
                    </div>
                </div>
            );
        case 'qibla-compass':
            return (
                <div className="widget-mini widget-mini-qibla">
                    <Compass size={16} strokeWidth={2} />
                </div>
            );
        case 'weather':
            return (
                <div className="widget-mini widget-mini-weather">
                    <CloudSun size={16} strokeWidth={2} />
                    <div className="widget-mini-cloud-bars"><span /><span /></div>
                </div>
            );
        case 'tasbeeh':
            return (
                <div className="widget-mini widget-mini-tasbeeh">
                    <div className="widget-mini-beads"><span /><span /><span /></div>
                </div>
            );
        case 'bookmarks':
            return (
                <div className="widget-mini widget-mini-bookmarks">
                    <div className="widget-mini-chip">YouTube</div>
                    <div className="widget-mini-chip">Gmail</div>
                    <div className="widget-mini-chip">Docs</div>
                </div>
            );
        case 'note':
            return (
                <div className="widget-mini widget-mini-note">
                    <StickyNote size={14} strokeWidth={2} />
                    <div className="widget-mini-note-paper" />
                </div>
            );
        default:
            return (
                <div className="widget-mini widget-mini-generic">
                    <CalendarDays size={15} strokeWidth={2} />
                    <FileText size={15} strokeWidth={2} />
                </div>
            );
    }
};
