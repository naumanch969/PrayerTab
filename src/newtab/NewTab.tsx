import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import Onboarding from '../components/Onboarding';
import SettingsPanel from '../components/SettingsPanel';
import type { UserSettings, WidgetDisplayMode, WidgetId, WidgetLayout } from '../types';
import type { WidgetRuntimeData } from './widgets/types';

import { NAV_WIDGETS } from './constants';
import { clampLayoutToViewport, defaultLayoutForIndex, getDailyBackground, normalizeLayout } from './utils';
import type { WidgetNavId } from './types';

import { useWidgetInteraction } from './hooks/useWidgetInteraction';
import { WidgetCard } from './components/WidgetCard';
import { WidgetSidebar } from './components/WidgetSidebar';

const NewTab: React.FC = () => {
    const storage = useStorage();
    const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>(null);
    const [showCustomizePrompt, setShowCustomizePrompt] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeNav, setActiveNav] = useState<WidgetNavId | null>('salah');
    const [activeNavTop, setActiveNavTop] = useState(0);
    const [activeWidgetSettingsId, setActiveWidgetSettingsId] = useState<WidgetId | null>(null);
    const [undoStack, setUndoStack] = useState<Array<Partial<Record<WidgetId, WidgetLayout>>>>([]);
    const [redoStack, setRedoStack] = useState<Array<Partial<Record<WidgetId, WidgetLayout>>>>([]);

    const promptSeenPersisted = useRef(false);
    const settingsRef = useRef<UserSettings | null>(null);

    const defaultBg = useMemo(() => getDailyBackground(new Date()), []);

    const bgStyle = useMemo(() => {
        const source = storage.settings?.backgroundSource;
        const bgVal = storage.settings?.background;

        if (source === 'solid' && bgVal) {
            return { backgroundColor: bgVal };
        }
        if (source === 'gradient' && bgVal) {
            return { backgroundImage: bgVal };
        }
        
        const urlToUse = bgVal || defaultBg;
        return { backgroundImage: `url(${urlToUse})` };
    }, [storage.settings, defaultBg]);

    const overlayOpacity = storage.settings?.backgroundOverlayOpacity ?? 0;

    useEffect(() => {
        settingsRef.current = storage.settings ?? null;
    }, [storage.settings]);

    useEffect(() => {
        if (storage.loading || !storage.settings?.onboardingComplete) return;
        if (storage.settings.hasSeenCustomizePrompt) return;

        setShowCustomizePrompt(true);

        if (!promptSeenPersisted.current) {
            promptSeenPersisted.current = true;
            void storage.updateSettings({
                ...storage.settings,
                hasSeenCustomizePrompt: true,
            });
        }
    }, [storage.loading, storage.settings?.onboardingComplete, storage.settings?.hasSeenCustomizePrompt]);

    const persistSettings = (updates: Partial<UserSettings>) => {
        const currentSettings = settingsRef.current;
        if (!currentSettings) return;

        const nextSettings: UserSettings = {
            ...currentSettings,
            ...updates,
        };

        settingsRef.current = nextSettings;
        void storage.updateSettings(nextSettings);
    };

    const { layoutDraft, setLayoutDraft, startInteraction, activeInteraction } = useWidgetInteraction(
        isEditMode,
        storage.settings?.widgetLayouts ?? {},
        (layouts) => {
            if (isEditMode) {
                pushUndoSnapshot();
            }
            if (settingsRef.current) {
                void storage.updateSettings({
                    ...settingsRef.current,
                    widgetLayouts: layouts as Record<WidgetId, WidgetLayout>,
                });
            }
        }
    );

    const cloneLayouts = (layouts: Partial<Record<WidgetId, WidgetLayout>>) => {
        const cloned: Partial<Record<WidgetId, WidgetLayout>> = {};
        Object.entries(layouts).forEach(([widgetId, layout]) => {
            if (!layout) return;
            cloned[widgetId as WidgetId] = { ...layout };
        });
        return cloned;
    };

    const pushUndoSnapshot = () => {
        if (!isEditMode) return;
        setUndoStack((prev) => [...prev, cloneLayouts(layoutDraft)]);
        setRedoStack([]);
    };

    const enterEditMode = () => {
        if (!settings) return;
        setUndoStack([]);
        setRedoStack([]);
        setIsEditMode(true);
        setSidebarOpen(true);
    };

    const exitEditMode = () => {
        setIsEditMode(false);
        setActiveWidgetSettingsId(null);
    };

    const undoEdit = () => {
        if (!isEditMode) return;
        setUndoStack((prev) => {
            const last = prev[prev.length - 1];
            if (!last) return prev;

            setRedoStack((redoPrev) => [...redoPrev, cloneLayouts(layoutDraftRef.current)]);
            setLayoutDraft(last);
            persistSettings({ widgetLayouts: last as Record<WidgetId, WidgetLayout> });
            return prev.slice(0, -1);
        });
    };

    const redoEdit = () => {
        if (!isEditMode) return;
        setRedoStack((prev) => {
            const last = prev[prev.length - 1];
            if (!last) return prev;

            setUndoStack((undoPrev) => [...undoPrev, cloneLayouts(layoutDraftRef.current)]);
            setLayoutDraft(last);
            persistSettings({ widgetLayouts: last as Record<WidgetId, WidgetLayout> });
            return prev.slice(0, -1);
        });
    };

    const finishEditMode = () => {
        setUndoStack([]);
        setRedoStack([]);
        exitEditMode();
    };

    useEffect(() => {
        if (!isEditMode) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                finishEditMode();
                return;
            }

            const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey;
            const isRedo = (event.ctrlKey || event.metaKey) && (
                (event.shiftKey && event.key.toLowerCase() === 'z') || 
                (event.key.toLowerCase() === 'y')
            );

            if (isUndo) {
                event.preventDefault();
                undoEdit();
            } else if (isRedo) {
                event.preventDefault();
                redoEdit();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isEditMode, undoStack, redoStack, layoutDraft]);

    const layoutDraftRef = useRef(layoutDraft);

    useEffect(() => {
        layoutDraftRef.current = layoutDraft;
    }, [layoutDraft]);

    useEffect(() => {
        let resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null;

        const normalizeToViewport = () => {
            if (!settingsRef.current) return;

            const currentLayouts = layoutDraftRef.current;
            const nextLayouts: Partial<Record<WidgetId, WidgetLayout>> = {};
            let changed = false;

            const activeWidgetIds = settingsRef.current.enabledWidgets ?? [];
            activeWidgetIds.forEach((widgetId, index) => {
                const source = currentLayouts[widgetId] ?? settingsRef.current?.widgetLayouts[widgetId] ?? defaultLayoutForIndex(index, widgetId);
                const normalized = normalizeLayout(widgetId, source);
                const clamped = clampLayoutToViewport(normalized);
                nextLayouts[widgetId] = clamped;

                if (!source || source.x !== clamped.x || source.y !== clamped.y || source.w !== clamped.w || source.h !== clamped.h) {
                    changed = true;
                }
            });

            if (!changed) return;

            setLayoutDraft(nextLayouts);
            persistSettings({ widgetLayouts: nextLayouts as Record<WidgetId, WidgetLayout> });
        };

        const onResize = () => {
            if (resizeDebounceTimer) {
                clearTimeout(resizeDebounceTimer);
            }
            resizeDebounceTimer = setTimeout(normalizeToViewport, 150);
        };

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            if (resizeDebounceTimer) {
                clearTimeout(resizeDebounceTimer);
            }
        };
    }, []);

    useEffect(() => {
        if (!activeWidgetSettingsId) return;

        const onGlobalPointerDown = (event: PointerEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            if (target.closest('.canvas-widget-settings-popover')) return;
            if (target.closest('.canvas-widget-control-btn')) return;

            setActiveWidgetSettingsId(null);
        };

        window.addEventListener('pointerdown', onGlobalPointerDown);
        return () => window.removeEventListener('pointerdown', onGlobalPointerDown);
    }, [activeWidgetSettingsId]);

    const markCustomizePromptSeen = () => {
        setShowCustomizePrompt(false);
        if (!storage.settings || storage.settings.hasSeenCustomizePrompt) return;
        void storage.updateSettings({
            ...storage.settings,
            hasSeenCustomizePrompt: true,
        });
    };

    const openCustomizeFromPrompt = () => {
        enterEditMode();
        markCustomizePromptSeen();
    };

    const toggleWidgetStudio = () => {
        if (sidebarOpen) {
            setSidebarOpen(false);
            return;
        }

        enterEditMode();
    };

    if (storage.loading) return null;
    if (!storage.settings?.onboardingComplete) {
        return <Onboarding onComplete={(settings: UserSettings) => storage.updateSettings(settings)} />;
    }

    const { settings } = storage;
    const addedWidgets = settings.enabledWidgets ?? [];
    const activeWidgets = activeNav ? NAV_WIDGETS[activeNav] : [];
    const widgetRuntime: WidgetRuntimeData = {
        todayLog: storage.todayLog,
        streak: storage.streak,
        dhikr: storage.dhikr,
        intention: storage.intention,
        togglePrayer: storage.togglePrayer,
        tapDhikr: storage.tapDhikr,
        resetDhikr: storage.resetDhikr,
        setIntention: storage.setIntention,
    };

    const getWidgetLayoutFor = (widgetId: WidgetId, index: number): WidgetLayout => {
        const raw = layoutDraft[widgetId] ?? settings.widgetLayouts[widgetId] ?? defaultLayoutForIndex(index, widgetId);
        return clampLayoutToViewport(normalizeLayout(widgetId, raw));
    };

    const addWidget = (widgetId: WidgetId) => {
        if (addedWidgets.includes(widgetId)) return;

        if (isEditMode) {
            pushUndoSnapshot();
        }

        const nextEnabledWidgets = [...addedWidgets, widgetId];
        const nextLayouts = { ...layoutDraft };
        if (!nextLayouts[widgetId]) {
            nextLayouts[widgetId] = defaultLayoutForIndex(nextEnabledWidgets.length - 1, widgetId);
        }

        setLayoutDraft(nextLayouts);
        persistSettings({
            enabledWidgets: nextEnabledWidgets,
            widgetLayouts: nextLayouts as Record<WidgetId, WidgetLayout>,
        });
    };

    const removeWidget = (widgetId: WidgetId) => {
        if (isEditMode) {
            pushUndoSnapshot();
        }

        const nextEnabledWidgets = addedWidgets.filter((id) => id !== widgetId);
        const nextLayouts = { ...layoutDraft };
        const nextPreferences = { ...settings.widgetPreferences };

        delete nextLayouts[widgetId];
        delete nextPreferences[widgetId];

        setLayoutDraft(nextLayouts);
        setActiveWidgetSettingsId((current) => (current === widgetId ? null : current));

        persistSettings({
            enabledWidgets: nextEnabledWidgets,
            widgetLayouts: nextLayouts as Record<WidgetId, WidgetLayout>,
            widgetPreferences: nextPreferences,
        });
    };

    const setWidgetDisplayMode = (widgetId: WidgetId, displayMode: WidgetDisplayMode) => {
        const nextPreferences = {
            ...settings.widgetPreferences,
            [widgetId]: { displayMode },
        };
        persistSettings({ widgetPreferences: nextPreferences });
    };

    return (
        <div
            className="nt-root"
            data-theme={settings.themeMode || 'glass'}
            data-font={settings.fontFamily || 'inter'}
            style={{
                '--theme-accent': settings.themeAccent || '#d4a843',
                '--gold': settings.themeAccent || '#d4a843',
                '--gold-text': `color-mix(in srgb, ${settings.themeAccent || '#d4a843'} 68%, white)`,
                '--gold-dim': `color-mix(in srgb, ${settings.themeAccent || '#d4a843'} 15%, transparent)`,
                '--gold-glow': `color-mix(in srgb, ${settings.themeAccent || '#d4a843'} 33%, transparent)`,
            } as React.CSSProperties}
        >
            <div className="nt-bg" style={bgStyle} />
            <div className="nt-overlay" style={{ opacity: overlayOpacity / 100 }} />

            {showCustomizePrompt && (
                <div className="nt-customise-prompt" role="status" aria-live="polite">
                    <button className="nt-customise-link" onClick={openCustomizeFromPrompt}>
                        Customise your tab -&gt;
                    </button>
                    <button className="nt-customise-dismiss" onClick={markCustomizePromptSeen} aria-label="Dismiss customise prompt">
                        Later
                    </button>
                </div>
            )}

            <button className="nt-settings-btn" onClick={() => setActiveSettingsTab('settings')} title="Settings" aria-label="Settings">
                ⚙
            </button>

            <div className="widget-canvas" aria-label="Widget canvas">
                {isEditMode && <div className="canvas-grid-overlay" />}

                {addedWidgets.map((widgetId, index) => (
                    <WidgetCard
                        key={widgetId}
                        index={index}
                        widgetId={widgetId}
                        isEditMode={isEditMode}
                        layout={getWidgetLayoutFor(widgetId, index)}
                        displayMode={settings.widgetPreferences[widgetId]?.displayMode ?? 'auto'}
                        onDragStart={(wId, idx, e) => startInteraction('drag', wId, e, getWidgetLayoutFor(wId, idx))}
                        onResizeStart={(wId, idx, e) => startInteraction('resize', wId, e, getWidgetLayoutFor(wId, idx))}
                        onRemove={removeWidget}
                        isActiveSettings={activeWidgetSettingsId === widgetId}
                        onToggleSettings={(id) => setActiveWidgetSettingsId((curr) => (curr === id ? null : id))}
                        onSetDisplayMode={setWidgetDisplayMode}
                        onEnterEditMode={enterEditMode}
                        settings={settings}
                        runtime={widgetRuntime}
                        interactionKind={activeInteraction?.widgetId === widgetId ? activeInteraction.kind : null}
                    />
                ))}
            </div>

            <div className="widget-dock">
                <button
                    className="widget-plus-btn"
                    aria-label="Open widget sidebar"
                    title="Widgets"
                    onClick={toggleWidgetStudio}
                >
                    <Plus size={18} strokeWidth={2.3} />
                </button>
                {!isEditMode && (
                    <button
                        className="widget-mini-btn"
                        aria-label="Enter edit mode"
                        title="Edit layout"
                        onClick={enterEditMode}
                    >
                        Edit
                    </button>
                )}
            </div>

            <WidgetSidebar
                isOpen={sidebarOpen}
                isEditMode={isEditMode}
                isCollapsed={sidebarCollapsed}
                addedWidgets={addedWidgets}
                activeWidgets={activeWidgets}
                onToggleSidebar={() => setSidebarOpen((current) => !current)}
                onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
                onHoverExpandStart={() => {
                    if (sidebarCollapsed) {
                        setSidebarCollapsed(false);
                    }
                }}
                onOpenSettings={(tabId) => setActiveSettingsTab(tabId)}
                onAddWidget={addWidget}
                activeNav={activeNav}
                activeNavTop={activeNavTop}
                onActiveNavChange={(navId, top) => {
                    setActiveNav(navId);
                    setActiveNavTop(top);
                }}
                onClearActiveNav={() => setActiveNav(null)}
                onToggleEditMode={() => {
                    if (isEditMode) {
                        finishEditMode();
                    } else {
                        enterEditMode();
                    }
                }}
            />

            {activeSettingsTab !== null && (
                <SettingsPanel
                    activeTab={activeSettingsTab}
                    settings={settings}
                    onSave={(updated: UserSettings) => storage.updateSettings(updated)}
                    onClose={() => setActiveSettingsTab(null)}
                />
            )}
        </div>
    );
};

export default NewTab;