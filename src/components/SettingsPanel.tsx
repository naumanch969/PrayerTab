import React, { useState } from 'react';
import type { UserSettings, CalculationMethod } from '../types';
import { BACKGROUNDS } from '../newtab/constants';
import { RefreshCcw, Image as ImageIcon, Link as LinkIcon, Search, X, ChevronDown, MessageCircle } from 'lucide-react';

interface SettingsPanelProps {
  activeTab: string;
  settings: UserSettings;
  onSave: (updated: UserSettings) => void;
  onClose: () => void;
}

const METHODS: { value: CalculationMethod; label: string }[] = [
  { value: 'MWL', label: 'Muslim World League' },
  { value: 'ISNA', label: 'ISNA' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Makkah', label: 'Umm al-Qura (Makkah)' },
  { value: 'Karachi', label: 'Karachi' },
  { value: 'Tehran', label: 'Tehran' },
  { value: 'Shia', label: 'Shia (Leva)' },
];

const BG_SIDEBAR_ITEMS = [
  { id: 'collections', label: 'Collections', icon: RefreshCcw },
  { id: 'search', label: 'Image search', icon: ImageIcon },
  { id: 'url', label: 'Image url', icon: LinkIcon },
];

const MOCK_CATEGORIES = [
  {
    name: 'All',
    items: BACKGROUNDS.map((url, i) => ({ name: `Preset ${i + 1}`, url })),
  },
];

const BackgroundSettings: React.FC<{ settings: UserSettings; onSave: (u: UserSettings) => void; onClose: () => void; }> = ({ settings, onSave, onClose }) => {
  const [activeMenu, setActiveMenu] = useState('search');
  const [bgUrl, setBgUrl] = useState(settings.background || '');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualUrl, setManualUrl] = useState(bgUrl && bgUrl.startsWith('http') && !bgUrl.includes('loremflickr') && !bgUrl.includes('unsplash') ? bgUrl : '');

  const handleSelectBg = (url: string) => {
    setBgUrl(url);
    onSave({ ...settings, background: url || undefined });
  };

  const performSearch = () => {
    if (!search.trim()) return;
    setIsSearching(true);
    // Simulate API search via public proxy URL logic
    setTimeout(() => {
      const query = encodeURIComponent(search.trim());
      // Generate 12 distinct images using loremflickr keyword caching mechanism
      const results = Array.from({ length: 12 }).map((_, i) =>
        `https://loremflickr.com/1920/1080/${query}?lock=${i + 1}`
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 600);
  };

  const applyManualUrl = () => {
    if (manualUrl.trim()) {
      handleSelectBg(manualUrl.trim());
    }
  };

  return (
    <div className="bg-modal-layout">
      <div className="bg-modal-sidebar">
        <div className="bg-modal-title">Select the image</div>
        <div className="bg-menu-list">
          {BG_SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`bg-menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-modal-content">
        <button className="bg-modal-close" onClick={onClose}><X size={20} /></button>

        <div className="bg-content-scroll">
          {activeMenu === 'collections' && (
            <div className="bg-collections-view">
              {MOCK_CATEGORIES.map(cat => (
                <div key={cat.name} className="bg-category">
                  <div className="bg-category-title">{cat.name}</div>
                  <div className="bg-category-grid">
                    {cat.items.map(item => (
                      <div key={item.name} className="bg-category-card" onClick={() => handleSelectBg(item.url)}>
                        <div className={`bg-category-img ${bgUrl === item.url ? 'active' : ''}`} style={{ backgroundImage: `url(${item.url})` }}>
                          {bgUrl === item.url && <div className="bg-preset-check">✓</div>}
                        </div>
                        <div className="bg-category-label">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeMenu === 'search' && (
            <div className="bg-search-view">
              <label
                className="settings-label"
                style={{ color: 'var(--gold)', textTransform: 'none', fontSize: '12px' }}
              >
                Enter the keyword for the search
              </label>

              <div className="bg-search-input-wrapper">
                <ImageIcon size={20} className="bg-search-icon-left" />
                <input
                  className="bg-search-input"
                  placeholder="e.g. mosque, nature, stars..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') performSearch(); }}
                />
                <button className="bg-search-submit" onClick={performSearch}>
                  SEARCH <Search size={16} />
                </button>
              </div>
              <div className="bg-search-subtitle">Results from unsplash.com via proxy</div>

              <div className="bg-search-grid">
                {isSearching ? (
                  <div className="settings-placeholder" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                    Searching for "{search}"...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(url => (
                    <div key={url} className="bg-search-card" onClick={() => handleSelectBg(url)}>
                      <div className={`bg-search-img ${bgUrl === url ? 'active' : ''}`} style={{ backgroundImage: `url(${url})` }}>
                        {bgUrl === url && <div className="bg-preset-check">✓</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="settings-placeholder" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                    Type a keyword and click SEARCH to discover images.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMenu === 'url' && (
            <div className="bg-view-panel">
              <label className="settings-label">Paste Image URL manually</label>
              <div className="bg-search-input-wrapper" style={{ marginTop: '12px' }}>
                <input
                  className="bg-search-input"
                  style={{ paddingLeft: '16px' }}
                  placeholder="https://..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyManualUrl(); }}
                />
                <button className="bg-search-submit" onClick={applyManualUrl}>Apply</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const GeneralSettings: React.FC<{ tab: string; settings: UserSettings; onSave: (u: UserSettings) => void; onClose: () => void; }> = ({ tab, settings, onSave, onClose }) => {
  const [name, setName] = useState(settings.name);
  const [method, setMethod] = useState<CalculationMethod>(settings.calculationMethod);
  const [relocating, setRelocating] = useState(false);

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
      { timeout: 8000 },
    );
  };

  const title = tab === 'appearance' ? 'Appearance' : tab === 'about' ? 'About' : tab === 'feedback' ? 'Feedback' : 'General Settings';

  return (
    <div className="settings-card modal-large" onClick={(e) => e.stopPropagation()}>
      <div className="settings-header">
        <span className="settings-title">{title}</span>
        <button className="settings-close" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="settings-body-large">
        {tab === 'appearance' && (
          <div className="settings-grid">
            <div className="settings-section">
              <label className="settings-label">Typography</label>
              <div className="settings-method-grid">
                <button className="settings-method-btn active">Inter (Default)</button>
                <button className="settings-method-btn">Fraunces (Serif)</button>
                <button className="settings-method-btn">System UI</button>
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">Theme Mode</label>
              <div className="settings-method-grid">
                <button className="settings-method-btn active">Dark (Glassmorphism)</button>
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">Widget Opacity</label>
              <input type="range" min="0" max="100" defaultValue="40" className="settings-slider" />
              <div className="settings-slider-labels">
                <span>Transparent</span>
                <span>Opaque</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="settings-grid">
            <div className="settings-section">
              <label className="settings-label">Personalization</label>
              <input
                className="settings-input"
                style={{ paddingLeft: '16px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we address you?"
              />
            </div>

            <div className="settings-section">
              <label className="settings-label">Prayer Calculation Method</label>
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
            </div>

            <div className="settings-section">
              <label className="settings-label">Location Data</label>
              <div className="settings-location-box">
                <span className="location-hint">Accurate coordinates are required for precise prayer times calculation.</span>
                <button className="settings-relocate-btn" onClick={relocate} disabled={relocating}>
                  {relocating ? 'Detecting Coordinates…' : '📍 Auto-Detect My Location'}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'about' && (
          <div className="settings-about-wrapper">
            <img src="/icons/icon128.png" alt="PrayerTab Logo" className="about-logo" onError={(e) => e.currentTarget.style.display = 'none'} />
            <h2 className="about-heading">PrayerTab</h2>
            <p className="about-version">Version 1.0.0</p>
            <p className="about-desc">A serene, focus-driven dashboard designed to keep your intentions, prayers, and daily reflections perfectly aligned throughout the day.</p>
            <div className="about-links">
              <a href="#" className="about-link">Privacy Policy</a>
              <span className="dot-sep">•</span>
              <a href="#" className="about-link">Terms of Service</a>
              <span className="dot-sep">•</span>
              <a href="https://github.com/your-repo/PrayerTab" target="_blank" rel="noreferrer" className="about-link">Github Repository</a>
            </div>
          </div>
        )}

        {tab === 'feedback' && (
          <div className="settings-feedback-wrapper">
            <MessageCircle className="feedback-icon" size={48} />
            <h2 className="feedback-heading">We value your input</h2>
            <p className="feedback-desc">Notice a bug? Have an idea for a new widget? We'd love to hear your thoughts to help us improve PrayerTab.</p>
            <textarea
              className="settings-textarea"
              placeholder="Describe your suggestion or issue here..."
              rows={6}
            />
            <button className="settings-action-btn primary full-width" onClick={() => window.open('mailto:support@example.com?subject=PrayerTab Feedback')}>
              Send via Email
            </button>
          </div>
        )}
      </div>

      {tab === 'settings' && (
        <div className="settings-footer">
          <button className="settings-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="settings-save-btn" onClick={() => { save(); onClose(); }}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ activeTab, settings, onSave, onClose }) => {
  return (
    <div className="settings-overlay" onClick={onClose}>
      {activeTab === 'background' ? (
        <div className="settings-card bg-modal" onClick={(e) => e.stopPropagation()}>
          <BackgroundSettings settings={settings} onSave={onSave} onClose={onClose} />
        </div>
      ) : (
        <GeneralSettings tab={activeTab} settings={settings} onSave={onSave} onClose={onClose} />
      )}
    </div>
  );
};

export default SettingsPanel;
