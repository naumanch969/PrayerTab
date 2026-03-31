import React, { useState } from 'react';
import type { UserSettings, CalculationMethod, WidgetId } from '../types';

interface SettingsPanelProps {
  settings: UserSettings;
  onSave: (updated: UserSettings) => void;
  onClose: () => void;
}

const WIDGET_LIBRARY: { id: WidgetId; name: string; description: string; preview: string }[] = [
  { id: 'prayer-times', name: 'Prayer Times', description: 'Daily salah times with current/next state.', preview: 'Fajr · Dhuhr · Asr' },
  { id: 'next-prayer', name: 'Next Prayer Countdown', description: 'Live countdown until the upcoming prayer.', preview: 'Maghrib in 01:28:12' },
  { id: 'hijri-date', name: 'Hijri Date', description: 'Current Hijri day and month display.', preview: '20 Ramadan 1447' },
  { id: 'clock', name: 'Clock', description: 'Large digital time display in 12h/24h.', preview: '07:42 PM' },
  { id: 'daily-ayah', name: 'Daily Ayah', description: 'A rotating ayah with translation.', preview: 'Quran 2:286' },
  { id: 'focus-task', name: 'Focus Task', description: 'Single daily intention input and lock mode.', preview: 'Today: Finish study plan' },
  { id: 'dhikr-counter', name: 'Dhikr Counter', description: 'Tap counter with 33-cycle flow.', preview: 'Subhanallah · 18/33' },
  { id: 'prayer-streak', name: 'Prayer Streak', description: 'Track consistency across days.', preview: 'Streak: 5 days' },
  { id: 'qibla-compass', name: 'Qibla Compass', description: 'Direction guidance toward Makkah.', preview: 'Qibla 287°' },
  { id: 'weather', name: 'Weather', description: 'Local weather snapshot.', preview: '23°C · Clear' },
  { id: 'tasbeeh', name: 'Tasbeeh', description: 'Quick tasbeeh cycling panel.', preview: 'Alhamdulillah' },
  { id: 'ramadan-countdown', name: 'Ramadan Countdown', description: 'Countdown to Ramadan or Iftar mode.', preview: 'Iftar in 00:48:30' },
  { id: 'bookmarks', name: 'Bookmarks', description: 'Fast links for your common destinations.', preview: '3 quick links' },
  { id: 'note', name: 'Note', description: 'Simple free-text sticky note widget.', preview: 'Write reflection...' },
];

const DEFAULT_LAYOUT_WIDGETS = new Set<WidgetId>([
  'prayer-times',
  'next-prayer',
  'daily-ayah',
  'clock',
  'focus-task',
]);

const METHODS: { value: CalculationMethod; label: string }[] = [
  { value: 'MWL',    label: 'Muslim World League' },
  { value: 'ISNA',   label: 'ISNA' },
  { value: 'Egypt',  label: 'Egypt' },
  { value: 'Makkah', label: 'Umm al-Qura (Makkah)' },
  { value: 'Karachi',label: 'Karachi' },
  { value: 'Tehran', label: 'Tehran' },
  { value: 'Shia',   label: 'Shia (Leva)' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave, onClose }) => {
  const [name, setName] = useState(settings.name);
  const [method, setMethod] = useState<CalculationMethod>(settings.calculationMethod);
  const [enabledWidgets, setEnabledWidgets] = useState<WidgetId[]>(settings.enabledWidgets ?? []);
  const [relocating, setRelocating] = useState(false);

  const save = () => onSave({ ...settings, name: name.trim(), calculationMethod: method, enabledWidgets });

  const addWidget = (widgetId: WidgetId) => {
    if (DEFAULT_LAYOUT_WIDGETS.has(widgetId) || enabledWidgets.includes(widgetId)) return;

    const next = [...enabledWidgets, widgetId];
    setEnabledWidgets(next);
    onSave({ ...settings, name: name.trim(), calculationMethod: method, enabledWidgets: next });
  };

  const relocate = () => {
    setRelocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSave({
          ...settings,
          name: name.trim(),
          calculationMethod: method,
          enabledWidgets,
          location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        });
        setRelocating(false);
        onClose();
      },
      () => setRelocating(false),
      { timeout: 8000 },
    );
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <span className="settings-title">Settings</span>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          <label className="settings-label">Your name</label>
          <input
            className="settings-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />

          <label className="settings-label">Calculation method</label>
          <div className="settings-method-grid">
            {METHODS.map((m) => (
              <button
                key={m.value}
                className={`settings-method-btn ${method === m.value ? 'active' : ''}`}
                onClick={() => setMethod(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <label className="settings-label">Location</label>
          <button className="settings-relocate-btn" onClick={relocate} disabled={relocating}>
            {relocating ? 'Detecting…' : '📍 Update My Location'}
          </button>

          <label className="settings-label">Widget Library</label>
          <div className="settings-widget-grid">
            {WIDGET_LIBRARY.map((widget) => (
              <article key={widget.id} className="settings-widget-card">
                <div className="settings-widget-head">
                  <div className="settings-widget-name">{widget.name}</div>
                  <button
                    className={`settings-widget-add ${(DEFAULT_LAYOUT_WIDGETS.has(widget.id) || enabledWidgets.includes(widget.id)) ? 'added' : ''}`}
                    onClick={() => addWidget(widget.id)}
                    disabled={DEFAULT_LAYOUT_WIDGETS.has(widget.id) || enabledWidgets.includes(widget.id)}
                  >
                    {DEFAULT_LAYOUT_WIDGETS.has(widget.id) ? 'In Layout' : enabledWidgets.includes(widget.id) ? 'Added' : 'Add'}
                  </button>
                </div>
                <div className="settings-widget-preview">{widget.preview}</div>
                <div className="settings-widget-desc">{widget.description}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="settings-save-btn" onClick={() => { save(); onClose(); }}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
