import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { WIDGET_NAV, SETTINGS_NAV, WIDGET_LOOKUP } from '../constants';
import type { WidgetNavId } from '../types';
import type { WidgetId } from '../../types';
import { WidgetMiniPreview } from './WidgetMiniPreview';

interface WidgetSidebarProps {
    isOpen: boolean;
    isEditMode: boolean;
    isCollapsed: boolean;
    addedWidgets: WidgetId[];
    activeWidgets: WidgetId[];
    onToggleSidebar: () => void;
    onToggleCollapsed: () => void;
    onOpenSettings: () => void;
    onAddWidget: (widgetId: WidgetId) => void;
    activeNav: WidgetNavId | null;
    activeNavTop: number;
    onActiveNavChange: (navId: WidgetNavId, top: number) => void;
    onClearActiveNav: () => void;
}

export const WidgetSidebar: React.FC<WidgetSidebarProps> = ({ isOpen, isEditMode, isCollapsed, addedWidgets, activeWidgets, onToggleCollapsed, onOpenSettings, onAddWidget, activeNav, activeNavTop, onActiveNavChange, onClearActiveNav }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    className={`widget-sidebar-left open ${isCollapsed ? 'collapsed' : ''}`}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0, width: isCollapsed ? 78 : 286 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 30, mass: 0.8 }}
                >
                    <div
                        className="widget-sidebar-left-inner"
                        onClick={(event) => {
                            if (!isCollapsed) return;
                            const target = event.target as HTMLElement;
                            if (target.closest('button')) return;
                            onToggleCollapsed();
                        }}
                    >
                        <button
                            type="button"
                            className="widget-collapse-btn"
                            onClick={onToggleCollapsed}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? <PanelLeftOpen size={14} strokeWidth={2.2} /> : <PanelLeftClose size={14} strokeWidth={2.2} />}
                        </button>

                        <header className="widget-sidebar-head">
                            <div className="widget-sidebar-kicker">Widget Studio</div>
                            <h2 className="widget-sidebar-title">Build your canvas</h2>
                            <p className="widget-sidebar-subtitle">Add, arrange, and resize widgets to match your flow.</p>
                        </header>

                        <div className="widget-section">
                            <div className="widget-section-title">Library</div>
                            <div className="widget-nav-list">
                                {WIDGET_NAV.map((nav) => (
                                    <button
                                        key={nav.id}
                                        className={`widget-nav-item ${activeNav === nav.id ? 'active' : ''}`}
                                        onMouseEnter={(event) => onActiveNavChange(nav.id, event.currentTarget.offsetTop)}
                                        onFocus={(event) => onActiveNavChange(nav.id, event.currentTarget.offsetTop)}
                                    >
                                        <span className="widget-nav-icon-wrap">
                                            <nav.icon size={14} strokeWidth={2} />
                                        </span>
                                        <span className="widget-nav-copy">
                                            <span className="widget-nav-label">{nav.label}</span>
                                            <span className="widget-nav-hint">{nav.hint}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="widget-section widget-section-settings">
                            <div className="widget-section-title">Settings</div>
                            <div className="widget-nav-list">
                                {SETTINGS_NAV.map((nav) => (
                                    <button
                                        key={nav.id}
                                        className="widget-nav-item widget-nav-item-muted"
                                        onClick={onOpenSettings}
                                    >
                                        <span className="widget-nav-icon-wrap muted">
                                            <nav.icon size={13} strokeWidth={2} />
                                        </span>
                                        <span className="widget-nav-label">{nav.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="widget-edit-state">
                            {isEditMode ? 'Edit mode active while sidebar is open' : 'Open sidebar to edit layout'}
                        </div>
                    </div>

                    {!isCollapsed && activeNav && (
                        <motion.div
                            className="widget-options-flyout"
                            style={{ top: activeNavTop }}
                            initial={{ opacity: 0, x: -18, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -18, scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 290, damping: 30, mass: 0.65 }}
                            onPointerLeave={onClearActiveNav}
                        >
                            <div className="widget-options-head">
                                <div className="widget-options-kicker">{activeNav.toUpperCase()}</div>
                                <div className="widget-options-title">Choose widgets</div>
                            </div>
                            <div className="widget-options-grid">
                                {activeWidgets.map((widgetId) => {
                                    const widget = WIDGET_LOOKUP[widgetId];
                                    if (!widget) return null;

                                    const added = addedWidgets.includes(widgetId);
                                    return (
                                        <button
                                            key={widget.id}
                                            type="button"
                                            className={`widget-option-card ${added ? 'added' : ''}`}
                                            onClick={() => onAddWidget(widget.id)}
                                            disabled={added}
                                            aria-label={`${added ? 'Added' : 'Add'} ${widget.name}`}
                                        >
                                            {added && (
                                                <span className="widget-option-added-mark" aria-hidden="true">
                                                    <Check size={12} strokeWidth={2.4} />
                                                </span>
                                            )}
                                            <div className="widget-option-mini-wrap">
                                                <WidgetMiniPreview widgetId={widget.id} />
                                            </div>
                                            <div className="widget-option-name">{widget.name}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </motion.aside>
            )}
        </AnimatePresence>
    );
};
