import React, { useRef, useState } from 'react';
import { Download, MessageCircle, ShieldCheck, Upload, X } from 'lucide-react';
import { exportAllData, importAllData } from '../../lib/storage';
import type { CalculationMethod, UserSettings } from '../../types';
import LayoutPresets from './LayoutPresets';
import { METHODS } from './constants';

interface GeneralSettingsProps {
  tab: string;
  settings: UserSettings;
  onSave: (u: UserSettings) => void;
  onClose: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ tab, settings, onSave, onClose }) => {
  const [name, setName] = useState(settings.name);
  const [method, setMethod] = useState<CalculationMethod>(settings.calculationMethod);
  const [relocating, setRelocating] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState('');
  const importFileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    onSave({
      ...settings,
      name: name.trim(),
      calculationMethod: method,
    });
  };

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
      { timeout: 8000 }
    );
  };

  const handleExport = async () => {
    const json = await exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `5prayertab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      try {
        await importAllData(loadEvent.target?.result as string);
        setImportStatus('success');
        setImportError('');
        window.location.reload();
      } catch (err: unknown) {
        setImportStatus('error');
        setImportError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const title = tab === 'appearance' ? 'Appearance' : tab === 'about' ? 'About' : tab === 'feedback' ? 'Feedback' : 'General Settings';

  return (
    <div
      className="settings-card modal-large"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-settings-dialog="true"
      tabIndex={-1}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="settings-header">
        <span className="settings-title">{title}</span>
        <button className="settings-close" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="settings-body-large">
        {tab === 'appearance' && (
          <div className="settings-grid">
            <LayoutPresets settings={settings} onSave={onSave} />

            <div className="settings-section">
              <label className="settings-label">Typography</label>
              <div className="settings-method-grid">
                <button className={`settings-method-btn ${settings.fontFamily === 'inter' || !settings.fontFamily ? 'active' : ''}`} onClick={() => onSave({ ...settings, fontFamily: 'inter' })}>DM Sans (Default)</button>
                <button className={`settings-method-btn ${settings.fontFamily === 'fraunces' ? 'active' : ''}`} onClick={() => onSave({ ...settings, fontFamily: 'fraunces' })}>Fraunces (Serif)</button>
                <button className={`settings-method-btn ${settings.fontFamily === 'system' ? 'active' : ''}`} onClick={() => onSave({ ...settings, fontFamily: 'system' })}>System UI</button>
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">Theme Mode</label>
              <div className="settings-method-grid">
                {['glass', 'solid', 'minimal'].map((themeMode) => (
                  <button key={themeMode} className={`settings-method-btn ${settings.themeMode === themeMode ? 'active' : ''}`} onClick={() => onSave({ ...settings, themeMode: themeMode as any })}>
                    {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">Accent Palette</label>
              <div className="settings-method-grid" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#d4a843', '#ffffff', '#2ecc71', '#1abc9c', '#3498db', '#e74c3c', '#9b59b6', '#f39c12'].map((color) => (
                  <button
                    key={color}
                    onClick={() => onSave({ ...settings, themeAccent: color })}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: color, border: settings.themeAccent === color ? '2px solid white' : '2px solid transparent', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="settings-grid">
            <div className="settings-section">
              <label className="settings-label">Personalization</label>
              <input className="settings-input" style={{ paddingLeft: '16px' }} value={name} onChange={(event) => setName(event.target.value)} placeholder="How should we address you?" />
            </div>

            <div className="settings-section">
              <label className="settings-label">Prayer Calculation Method</label>
              <div className="settings-method-grid">
                {METHODS.map((m) => (
                  <button key={m.value} className={`settings-method-btn ${method === m.value ? 'active' : ''}`} onClick={() => setMethod(m.value)}>{m.label}</button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">Location Data</label>
              <div className="settings-location-box">
                <span className="location-hint">Accurate coordinates are required for precise prayer times calculation.</span>
                <button className="settings-relocate-btn" onClick={relocate} disabled={relocating}>{relocating ? 'Detecting Coordinates…' : '📍 Auto-Detect My Location'}</button>
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">Clock Settings</label>
              <div className="settings-method-grid">
                <button className={`settings-method-btn ${settings.clockFormat === '12h' ? 'active' : ''}`} onClick={() => onSave({ ...settings, clockFormat: '12h' })}>12-Hour</button>
                <button className={`settings-method-btn ${settings.clockFormat === '24h' ? 'active' : ''}`} onClick={() => onSave({ ...settings, clockFormat: '24h' })}>24-Hour</button>
              </div>
              <label className="settings-label" style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={settings.clockShowSeconds} onChange={(event) => onSave({ ...settings, clockShowSeconds: event.target.checked })} style={{ marginRight: '8px' }} /> Show Seconds
              </label>
            </div>

            <div className="settings-section">
              <label className="settings-label"><ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Privacy &amp; Data Portability</label>
              <p className="settings-hint">All your data is stored locally on this device only — never sent to any server.</p>
              <div className="settings-data-actions">
                <button className="settings-method-btn" onClick={handleExport}>
                  <Download size={14} style={{ marginRight: '8px' }} />Export Backup (.json)
                </button>
                <button className="settings-method-btn" onClick={() => importFileRef.current?.click()}>
                  <Upload size={14} style={{ marginRight: '8px' }} />Import Backup
                </button>
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".json,application/json"
                  style={{ display: 'none' }}
                  onChange={handleImportFile}
                />
              </div>
              {importStatus === 'success' && <p className="settings-hint success">✓ Import successful — reloading…</p>}
              {importStatus === 'error' && <p className="settings-hint error">✗ {importError}</p>}
            </div>
          </div>
        )}

        {tab === 'feedback' && (
          <div className="settings-grid settings-info-grid">
            <section className="settings-section settings-info-card">
              <div className="settings-info-head">
                <MessageCircle size={24} />
                <h3>Share Your Thoughts</h3>
              </div>
              <p className="settings-hint">Help us craft the best spiritual companion for your daily tab. Share bugs, feature ideas, or general feedback.</p>
              <div className="settings-data-actions">
                <button className="settings-action-btn primary" onClick={() => window.open('https://github.com/yourusername/5PrayerTab/issues', '_blank')}>
                  Report a Bug on GitHub
                </button>
                <button className="settings-action-btn" onClick={() => window.open('mailto:salam@5prayertab.com?subject=Feature Idea')}>
                  Suggest a Feature via Email
                </button>
              </div>
            </section>

            <section className="settings-section settings-info-card">
              <label className="settings-label">Quick Message</label>
              <textarea
                className="settings-textarea"
                rows={6}
                placeholder="Tell us what should be improved in PrayerTab..."
              />
              <button className="settings-action-btn" onClick={() => window.open('mailto:salam@5prayertab.com?subject=PrayerTab%20Feedback', '_blank')}>
                Send via Email
              </button>
            </section>
          </div>
        )}

        {tab === 'about' && (
          <div className="settings-grid settings-info-grid">
            <section className="settings-section settings-info-card about-card-top">
              <div className="settings-info-brand">
                <img src="/icons/icon128.png" alt="5PrayerTab Logo" className="about-logo" onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }} />
                <div>
                  <h2 className="about-heading">5PrayerTab</h2>
                  <p className="about-version">Version 1.2.0 • Stable</p>
                </div>
              </div>
              <p className="about-desc">A distraction-free, spiritually aligned new tab experience that keeps prayer, reflection, and daily intention in view.</p>
            </section>

            <section className="settings-section settings-info-card">
              <label className="settings-label">Project</label>
              <p className="settings-hint">Crafted with intention to support mindful browsing and consistent worship routines.</p>
              <p className="settings-hint">Built by Opstin Technologies.</p>
              <div className="about-links">
                <a href="https://opstintechnologies.com" target="_blank" rel="noreferrer" className="about-link">Opstin Technologies</a>
                <span className="dot-sep">•</span>
                <a href="#" className="about-link">Website</a>
                <span className="dot-sep">•</span>
                <a href="#" className="about-link">Privacy</a>
                <span className="dot-sep">•</span>
                <a href="#" className="about-link">Terms</a>
                <span className="dot-sep">•</span>
                <a href="https://github.com/your-repo/PrayerTab" target="_blank" rel="noreferrer" className="about-link">GitHub</a>
              </div>
            </section>
          </div>
        )}
      </div>

      {tab === 'settings' && (
        <div className="settings-footer">
          <button className="settings-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="settings-save-btn" onClick={() => {
            save();
            onClose();
          }}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default GeneralSettings;
