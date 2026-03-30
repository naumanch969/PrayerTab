import React, { useState } from 'react';
import type { UserSettings, CalculationMethod } from '../types';

interface SettingsPanelProps {
  settings: UserSettings;
  onSave: (updated: UserSettings) => void;
  onClose: () => void;
}

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
  const [relocating, setRelocating] = useState(false);

  const save = () => onSave({ ...settings, name: name.trim(), calculationMethod: method });

  const relocate = () => {
    setRelocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSave({
          ...settings,
          name: name.trim(),
          calculationMethod: method,
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
