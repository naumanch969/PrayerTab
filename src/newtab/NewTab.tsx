import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import Onboarding from '../components/Onboarding';
import SettingsPanel from '../components/SettingsPanel';
import type { UserSettings, WidgetId } from '../types';

// Rotating mosque background images (Unsplash free-to-use)
const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1920&q=80', // Masjid al-Haram
  'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1920&q=80', // Sultan Ahmed Blue Mosque
  'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1920&q=80', // Hassan II
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1920&q=80', // Sheikh Zayed
  'https://images.unsplash.com/photo-1559329373-916f3239e5c8?w=1920&q=80', // Medina
];

function getDailyBackground(date: Date): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return BACKGROUNDS[dayOfYear % BACKGROUNDS.length];
}

const WIDGET_LIBRARY: { id: WidgetId; name: string; description: string; preview: string }[] = [
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

const WIDGET_LOOKUP = Object.fromEntries(WIDGET_LIBRARY.map((w) => [w.id, w])) as Record<WidgetId, (typeof WIDGET_LIBRARY)[number]>;

type WidgetNavId = 'salah' | 'reflection' | 'focus' | 'utility';

const WIDGET_NAV: { id: WidgetNavId; label: string; icon: string }[] = [
  { id: 'salah', label: 'Salah', icon: '◷' },
  { id: 'reflection', label: 'Reflection', icon: '*' },
  { id: 'focus', label: 'Focus', icon: '+' },
  { id: 'utility', label: 'Utility', icon: '=' },
];

const SETTINGS_NAV: { id: string; label: string; icon: string }[] = [
  { id: 'widgets', label: 'Widgets', icon: '#' },
  { id: 'background', label: 'Background', icon: '[]' },
  { id: 'salah', label: 'Salah', icon: '◷' },
  { id: 'clock', label: 'Clock', icon: 'o' },
  { id: 'appearance', label: 'Appearance', icon: '*' },
  { id: 'about', label: 'About', icon: 'i' },
  { id: 'tutorial', label: 'Tutorial', icon: '?' },
  { id: 'feedback', label: 'Feedback', icon: '>' },
];

const NAV_WIDGETS: Record<WidgetNavId, WidgetId[]> = {
  salah: ['prayer-times', 'next-prayer', 'hijri-date', 'qibla-compass', 'ramadan-countdown'],
  reflection: ['daily-ayah', 'dhikr-counter', 'tasbeeh'],
  focus: ['focus-task', 'prayer-streak', 'clock'],
  utility: ['weather', 'bookmarks', 'note'],
};

const NewTab: React.FC = () => {
  const storage = useStorage();
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomizePrompt, setShowCustomizePrompt] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<WidgetNavId | null>('salah');
  const [activeNavTop, setActiveNavTop] = useState(0);
  const promptSeenPersisted = useRef(false);

  const bg = useMemo(() => getDailyBackground(new Date()), []);

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

  // Show onboarding until setup is complete
  if (storage.loading) return null;
  if (!storage.settings?.onboardingComplete) {
    return (
      <Onboarding
        onComplete={(s: UserSettings) => storage.updateSettings(s)}
      />
    );
  }

  const { settings } = storage;
  const addedWidgets = settings?.enabledWidgets ?? [];

  const addWidget = (widgetId: WidgetId) => {
    if (!settings || addedWidgets.includes(widgetId)) return;
    void storage.updateSettings({
      ...settings,
      enabledWidgets: [...addedWidgets, widgetId],
    });
  };

  const onWidgetNavEnter = (event: React.MouseEvent<HTMLButtonElement>, navId: WidgetNavId) => {
    setActiveNav(navId);
    setActiveNavTop(event.currentTarget.offsetTop);
  };

  const activeWidgets = activeNav ? NAV_WIDGETS[activeNav] : [];

  return (
    <div className="nt-root">
      {/* Background */}
      <div
        className="nt-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="nt-overlay" />

      {/* One-time prompt */}
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

      {/* Empty-by-default canvas */}
      <div className="widget-canvas" aria-label="Widget canvas">
        {addedWidgets.map((widgetId, index) => {
          const widget = WIDGET_LOOKUP[widgetId];
          const col = index % 3;
          const row = Math.floor(index / 3);
          const left = 34 + col * 280;
          const top = 92 + row * 168;

          return (
            <article key={widgetId} className="canvas-widget" style={{ left, top }}>
              <div className="canvas-widget-title">{widget.name}</div>
              <div className="canvas-widget-preview">{widget.preview}</div>
              <div className="canvas-widget-desc">{widget.description}</div>
            </article>
          );
        })}
      </div>

      {/* Bottom-left controls + left sidebar */}
      <div className="widget-dock">
        <button
          className="widget-plus-btn"
          aria-label="Open widget sidebar"
          title="Widgets"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          +
        </button>
        <button className="widget-mini-btn" aria-label="Share">
          ↗
        </button>
        <button className="widget-mini-btn" aria-label="Link">
          ⛓
        </button>
      </div>

      <aside className={`widget-sidebar-left ${sidebarOpen ? 'open' : ''}`}>
        <div className="widget-sidebar-left-inner">
          <button className="widget-undo-btn">↶ Undo</button>

          <div className="widget-section">
            <div className="widget-section-title">Widgets</div>
            <div className="widget-nav-list">
              {WIDGET_NAV.map((nav) => (
                <button
                  key={nav.id}
                  className={`widget-nav-item ${activeNav === nav.id ? 'active' : ''}`}
                  onMouseEnter={(event) => onWidgetNavEnter(event, nav.id)}
                >
                  <span className="widget-nav-icon">{nav.icon}</span>
                  <span>{nav.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="widget-section">
            <div className="widget-section-title">Settings</div>
            <div className="widget-nav-list">
              {SETTINGS_NAV.map((nav) => (
                <button
                  key={nav.id}
                  className="widget-nav-item widget-nav-item-muted"
                  onClick={() => setShowSettings(true)}
                >
                  <span className="widget-nav-icon">{nav.icon}</span>
                  <span>{nav.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="widget-close-btn" onClick={() => setSidebarOpen(false)}>
            ↓ Close
          </button>
        </div>

        {sidebarOpen && activeNav && (
          <div className="widget-options-flyout" style={{ top: activeNavTop }}>
            <div className="widget-options-grid">
              {activeWidgets.map((widgetId) => {
                const widget = WIDGET_LOOKUP[widgetId];
                const added = addedWidgets.includes(widgetId);
                return (
                  <article key={widget.id} className="widget-option-card">
                    <div className="widget-option-preview">{widget.preview}</div>
                    <div className="widget-option-name">{widget.name}</div>
                    <button
                      className={`widget-option-add ${added ? 'added' : ''}`}
                      onClick={() => addWidget(widget.id)}
                      disabled={added}
                    >
                      {added ? 'Added' : 'Add'}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* Settings overlay */}
      {showSettings && settings && (
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
