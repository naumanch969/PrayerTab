import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Share2, Link2, Plus } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import Onboarding from '../components/Onboarding';
import SettingsPanel from '../components/SettingsPanel';
import type { UserSettings, WidgetDisplayMode, WidgetId, WidgetLayout } from '../types';
import type { WidgetRuntimeData } from '../widgets/types';

import { NAV_WIDGETS } from './constants';
import { defaultLayoutForIndex, getDailyBackground } from './utils';
import type { WidgetNavId } from './types';

import { useWidgetInteraction } from './hooks/useWidgetInteraction';
import { WidgetCard } from './components/WidgetCard';
import { WidgetSidebar } from './components/WidgetSidebar';

const NewTab: React.FC = () => {
    const storage = useStorage();
    const [showSettings, setShowSettings] = useState(false);
    const [showCustomizePrompt, setShowCustomizePrompt] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeNav, setActiveNav] = useState<WidgetNavId | null>('salah');
    const [activeNavTop, setActiveNavTop] = useState(0);
    const [activeWidgetSettingsId, setActiveWidgetSettingsId] = useState<WidgetId | null>(null);

    const promptSeenPersisted = useRef(false);
    const settingsRef = useRef<UserSettings | null>(null);

    const bg = useMemo(() => getDailyBackground(new Date()), []);

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

    const { layoutDraft, setLayoutDraft, startInteraction } = useWidgetInteraction(
        sidebarOpen,
        storage.settings?.widgetLayouts ?? {},
        (layouts) => {
            if (settingsRef.current) {
                void storage.updateSettings({
                    ...settingsRef.current,
                    widgetLayouts: layouts as Record<WidgetId, WidgetLayout>,
                });
            }
        }
    );

    const markCustomizePromptSeen = () => {
        setShowCustomizePrompt(false);
        if (!storage.settings || storage.settings.hasSeenCustomizePrompt) return;
        void storage.updateSettings({
            ...storage.settings,
            hasSeenCustomizePrompt: true,
        });
    };

    const openCustomizeFromPrompt = () => {
        setSidebarOpen(true);
        markCustomizePromptSeen();
    };

    const isEditMode = sidebarOpen;

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
        setIntention: storage.setIntention,
    };

    const getWidgetLayoutFor = (widgetId: WidgetId, index: number): WidgetLayout => {
        return layoutDraft[widgetId] ?? settings.widgetLayouts[widgetId] ?? defaultLayoutForIndex(index);
    };

    const addWidget = (widgetId: WidgetId) => {
        if (addedWidgets.includes(widgetId)) return;

        const nextEnabledWidgets = [...addedWidgets, widgetId];
        const nextLayouts = { ...layoutDraft };
        if (!nextLayouts[widgetId]) {
            nextLayouts[widgetId] = defaultLayoutForIndex(nextEnabledWidgets.length - 1);
        }

        setLayoutDraft(nextLayouts);
        persistSettings({
            enabledWidgets: nextEnabledWidgets,
            widgetLayouts: nextLayouts as Record<WidgetId, WidgetLayout>,
        });
    };

    const removeWidget = (widgetId: WidgetId) => {
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
        <div className="nt-root">
            <div className="nt-bg" style={{ backgroundImage: `url(${bg})` }} />
            <div className="nt-overlay" />

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

            <button className="nt-settings-btn" onClick={() => setShowSettings(true)} title="Settings" aria-label="Settings">
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
                        settings={settings}
                        runtime={widgetRuntime}
                    />
                ))}
            </div>

            <div className="widget-dock">
                <button
                    className="widget-plus-btn"
                    aria-label="Open widget sidebar"
                    title="Widgets"
                    onClick={() => setSidebarOpen((current) => !current)}
                >
                    <Plus size={18} strokeWidth={2.3} />
                </button>
                <button className="widget-mini-btn" aria-label="Share"><Share2 size={13} strokeWidth={2} /></button>
                <button className="widget-mini-btn" aria-label="Link"><Link2 size={13} strokeWidth={2} /></button>
            </div>

            <WidgetSidebar
                isOpen={sidebarOpen}
                isEditMode={isEditMode}
                isCollapsed={sidebarCollapsed}
                addedWidgets={addedWidgets}
                activeWidgets={activeWidgets}
                onToggleSidebar={() => setSidebarOpen((current) => !current)}
                onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
                onOpenSettings={() => setShowSettings(true)}
                onAddWidget={addWidget}
                activeNav={activeNav}
                activeNavTop={activeNavTop}
                onActiveNavChange={(navId, top) => {
                    setActiveNav(navId);
                    setActiveNavTop(top);
                }}
                onClearActiveNav={() => setActiveNav(null)}
            />

            {showSettings && (
                <SettingsPanel
                    settings={settings}
                    onSave={(updated: UserSettings) => storage.updateSettings(updated)}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default NewTab;