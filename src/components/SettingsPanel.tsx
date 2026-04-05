import React, { useEffect, useRef, useState } from 'react';
import type { UserSettings, CalculationMethod, BackgroundSource, LayoutPreset } from '../types';
import { BACKGROUNDS } from '../newtab/constants';
import { RefreshCcw, Image as ImageIcon, Link as LinkIcon, Search, X, Palette, Paintbrush, UploadCloud, MessageCircle, Trash2, Plus, Download, Upload, ShieldCheck } from 'lucide-react';
import { exportAllData, importAllData } from '../lib/storage';
import { SYSTEM_PRESETS } from '../newtab/presets';

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
  { id: 'search', label: 'Image Search', icon: ImageIcon },
  { id: 'url', label: 'Image URL', icon: LinkIcon },
  { id: 'solid', label: 'Solid Color', icon: Palette },
  { id: 'gradient', label: 'Gradient', icon: Paintbrush },
  { id: 'upload', label: 'Upload Local', icon: UploadCloud },
];

const MOCK_CATEGORIES = [
  {
    name: 'All',
    items: BACKGROUNDS.map((url, i) => ({ name: `Preset ${i + 1}`, url })),
  },
];

const SOLID_COLORS = [
  '#0a0805', '#121212', '#1a1f2e', '#2d3748', '#2c3e50',
  '#0a192f', '#192734', '#3e2723', '#2e3b32', '#4a4036'
];

const GRADIENTS = [
  'linear-gradient(135deg, #0a0805 0%, #1a1f2e 100%)',
  'radial-gradient(circle at top right, #374151, #111827)',
  'linear-gradient(to bottom, #2c3e50, #000000)',
  'linear-gradient(45deg, #1c1c1c, #3e2723)',
  'linear-gradient(160deg, #1f2937 0%, #000000 100%)',
  'radial-gradient(circle at center, #2d3748, #000000)',
];

const HEX_COLOR_PATTERN = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

const getInitialSolidColor = (settings: UserSettings): string => {
  if (settings.backgroundSource === 'solid' && settings.background && HEX_COLOR_PATTERN.test(settings.background)) {
    return settings.background;
  }
  return '#0a0805';
};

const getInitialGradientColors = (settings: UserSettings): { start: string; end: string } => {
  const fallback = { start: '#0a0805', end: '#1a1f2e' };
  if (settings.backgroundSource !== 'gradient' || !settings.background) {
    return fallback;
  }

  const matches = settings.background.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
  if (!matches || matches.length < 2) {
    return fallback;
  }

  return { start: matches[0], end: matches[1] };
};

const LayoutPresets: React.FC<{ settings: UserSettings; onSave: (u: UserSettings) => void; }> = ({ settings, onSave }) => {
  const [newPresetName, setNewPresetName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleApply = (preset: LayoutPreset) => {
    onSave({
      ...settings,
      enabledWidgets: preset.widgets,
      widgetLayouts: preset.layouts as any,
      widgetPreferences: preset.preferences as any,
    });
  };

  const handleSaveCurrent = () => {
    if (!newPresetName.trim()) return;
    const newPreset: LayoutPreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      widgets: [...settings.enabledWidgets],
      layouts: { ...settings.widgetLayouts },
      preferences: { ...settings.widgetPreferences },
    };
    onSave({
      ...settings,
      customPresets: [...(settings.customPresets || []), newPreset],
    });
    setNewPresetName('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onSave({
      ...settings,
      customPresets: settings.customPresets?.filter(p => p.id !== id),
    });
  };

  return (
    <div className="settings-section">
      <label className="settings-label">Layout Presets</label>
      <div className="settings-method-grid">
        {SYSTEM_PRESETS.map(p => (
           <button key={p.id} className="settings-method-btn" onClick={() => handleApply(p)}>
             {p.name}
           </button>
        ))}
      </div>

      {(settings.customPresets?.length ?? 0) > 0 && (
         <>
           <label className="settings-label" style={{ marginTop: '16px' }}>My Custom Presets</label>
           <div className="settings-method-grid">
             {settings.customPresets?.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: '4px' }}>
                  <button className="settings-method-btn" style={{ flex: 1 }} onClick={() => handleApply(p)}>
                    {p.name}
                  </button>
                  <button className="settings-method-btn" style={{ width: '36px', padding: 0 }} onClick={() => handleDelete(p.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
             ))}
           </div>
         </>
      )}

      <div style={{ marginTop: '16px' }}>
        {isAdding ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              className="settings-input" 
              placeholder="Preset Name" 
              value={newPresetName}
              onChange={e => setNewPresetName(e.target.value)}
              autoFocus
            />
            <button className="settings-method-btn active" onClick={handleSaveCurrent}>Save</button>
            <button className="settings-method-btn" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        ) : (
          <button className="settings-method-btn" style={{ width: '100%' }} onClick={() => setIsAdding(true)}>
            <Plus size={14} style={{ marginRight: '8px' }} /> Save Current Layout as Preset
          </button>
        )}
      </div>
    </div>
  );
};

const BackgroundSettings: React.FC<{ settings: UserSettings; onSave: (u: UserSettings) => void; onClose: () => void; }> = ({ settings, onSave, onClose }) => {
  const [activeMenu, setActiveMenu] = useState('collections');
  const [bgUrl, setBgUrl] = useState(settings.background || '');
  const [bgSource, setBgSource] = useState<BackgroundSource>(settings.backgroundSource || 'library');
  const [overlayOpacity, setOverlayOpacity] = useState(settings.backgroundOverlayOpacity ?? 0);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualUrl, setManualUrl] = useState(bgUrl && bgUrl.startsWith('http') && !bgUrl.includes('loremflickr') && !bgUrl.includes('unsplash') ? bgUrl : '');
  const [customSolidColor, setCustomSolidColor] = useState(getInitialSolidColor(settings));
  const initialGradientColors = getInitialGradientColors(settings);
  const [customGradientStart, setCustomGradientStart] = useState(initialGradientColors.start);
  const [customGradientEnd, setCustomGradientEnd] = useState(initialGradientColors.end);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectBg = (val: string, source: BackgroundSource) => {
    setBgUrl(val);
    setBgSource(source);
    onSave({ ...settings, background: val || undefined, backgroundSource: source });
  };

  const handleOpacityChange = (val: number) => {
    setOverlayOpacity(val);
    onSave({ ...settings, backgroundOverlayOpacity: val });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleSelectBg(result, 'upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const performSearch = () => {
    if (!search.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const query = encodeURIComponent(search.trim());
      const results = Array.from({ length: 12 }).map((_, i) =>
        `https://loremflickr.com/1920/1080/${query}?lock=${i + 1}`
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 600);
  };

  const applyManualUrl = () => {
    if (manualUrl.trim()) {
      handleSelectBg(manualUrl.trim(), 'url');
    }
  };

  const applyCustomSolid = (color: string) => {
    setCustomSolidColor(color);
    handleSelectBg(color, 'solid');
  };

  const applyCustomGradient = (startColor: string, endColor: string) => {
    const gradient = `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
    handleSelectBg(gradient, 'gradient');
  };

  return (
    <div
      className="settings-card bg-modal-card"
      role="dialog"
      aria-modal="true"
      aria-label="Background settings"
      data-settings-dialog="true"
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}
    >
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

          <div className="bg-sidebar-bottom-controls" style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
            <div className="settings-section" style={{ padding: 0 }}>
              <label className="settings-label" style={{ fontSize: '11px' }}>Overlay Darkness ({overlayOpacity}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={overlayOpacity}
                onChange={(e) => handleOpacityChange(parseInt(e.target.value, 10))}
                className="settings-slider"
                style={{ marginTop: '8px' }}
              />
            </div>
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
                      <div key={item.name} className="bg-category-card" onClick={() => handleSelectBg(item.url, 'library')}>
                        <div className={`bg-category-img ${bgUrl === item.url && bgSource === 'library' ? 'active' : ''}`} style={{ backgroundImage: `url(${item.url})` }}>
                          {bgUrl === item.url && bgSource === 'library' && <div className="bg-preset-check">✓</div>}
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
              <label className="settings-label" style={{ color: 'var(--gold)', textTransform: 'none', fontSize: '12px' }}>
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
                    <div key={url} className="bg-search-card" onClick={() => handleSelectBg(url, 'url')}>
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

          {activeMenu === 'solid' && (
            <div className="bg-collections-view">
              <div className="bg-category">
                <div className="bg-category-title">Solid Colors</div>
                <div className="bg-category-grid">
                  {SOLID_COLORS.map(color => (
                    <div key={color} className="bg-category-card" onClick={() => handleSelectBg(color, 'solid')}>
                      <div className={`bg-category-img ${bgUrl === color && bgSource === 'solid' ? 'active' : ''}`} style={{ backgroundColor: color }}>
                        {bgUrl === color && bgSource === 'solid' && <div className="bg-preset-check">✓</div>}
                      </div>
                      <div className="bg-category-label">{color}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-view-panel" style={{ marginTop: '8px' }}>
                  <label className="settings-label">Custom color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="color"
                      aria-label="Pick custom solid color"
                      value={customSolidColor}
                      onChange={(e) => applyCustomSolid(e.target.value)}
                      style={{ width: '48px', height: '40px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', padding: '4px', cursor: 'pointer' }}
                    />
                    <input
                      className="settings-input"
                      value={customSolidColor}
                      onChange={(e) => setCustomSolidColor(e.target.value)}
                      onBlur={() => {
                        if (HEX_COLOR_PATTERN.test(customSolidColor)) {
                          applyCustomSolid(customSolidColor);
                        }
                      }}
                      placeholder="#0a0805"
                      aria-label="Custom solid color hex value"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'gradient' && (
            <div className="bg-collections-view">
              <div className="bg-category">
                <div className="bg-category-title">Gradients</div>
                <div className="bg-category-grid">
                  {GRADIENTS.map((grad, i) => (
                    <div key={grad} className="bg-category-card" onClick={() => handleSelectBg(grad, 'gradient')}>
                      <div className={`bg-category-img ${bgUrl === grad && bgSource === 'gradient' ? 'active' : ''}`} style={{ backgroundImage: grad }}>
                        {bgUrl === grad && bgSource === 'gradient' && <div className="bg-preset-check">✓</div>}
                      </div>
                      <div className="bg-category-label">Gradient {i + 1}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-view-panel" style={{ marginTop: '8px' }}>
                  <label className="settings-label">Custom gradient</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="settings-label" style={{ fontSize: '10px' }}>Start</label>
                      <input
                        type="color"
                        aria-label="Pick gradient start color"
                        value={customGradientStart}
                        onChange={(e) => {
                          const next = e.target.value;
                          setCustomGradientStart(next);
                          applyCustomGradient(next, customGradientEnd);
                        }}
                        style={{ width: '100%', height: '40px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', padding: '4px', cursor: 'pointer' }}
                      />
                    </div>
                    <div>
                      <label className="settings-label" style={{ fontSize: '10px' }}>End</label>
                      <input
                        type="color"
                        aria-label="Pick gradient end color"
                        value={customGradientEnd}
                        onChange={(e) => {
                          const next = e.target.value;
                          setCustomGradientEnd(next);
                          applyCustomGradient(customGradientStart, next);
                        }}
                        style={{ width: '100%', height: '40px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', padding: '4px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <button
                    className="settings-method-btn"
                    style={{ marginTop: '10px' }}
                    onClick={() => applyCustomGradient(customGradientStart, customGradientEnd)}
                  >
                    Apply custom gradient
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'upload' && (
            <div className="bg-view-panel">
              <label className="settings-label">Upload a Local Image</label>
              <div style={{ marginTop: '16px', padding: '40px', border: '2px dashed var(--glass-border)', borderRadius: '12px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <UploadCloud size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Select an image file from your computer to use as the background.</p>
                <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                <button className="settings-method-btn" style={{ width: 'auto', padding: '12px 24px', display: 'inline-block' }} onClick={() => fileInputRef.current?.click()}>
                  Browse Files
                </button>
              </div>
              {bgSource === 'upload' && bgUrl && (
                <div style={{ marginTop: '24px' }}>
                  <label className="settings-label">Current Uploaded Image preview</label>
                  <div className="bg-category-img" style={{ backgroundImage: `url(${bgUrl})`, height: '240px', width: '100%', marginTop: '12px', cursor: 'default' }}></div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

const GeneralSettings: React.FC<{ tab: string; settings: UserSettings; onSave: (u: UserSettings) => void; onClose: () => void; }> = ({ tab, settings, onSave, onClose }) => {
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
      { timeout: 8000 },
    );
  };

  const handleExport = async () => {
    const json = await exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `5prayertab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        await importAllData(ev.target?.result as string);
        setImportStatus('success');
        setImportError('');
        window.location.reload();
      } catch (err: unknown) {
        setImportStatus('error');
        setImportError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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
      onClick={(e) => e.stopPropagation()}
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
                {['glass', 'solid', 'minimal'].map(t => (
                  <button key={t} className={`settings-method-btn ${settings.themeMode === t ? 'active' : ''}`} onClick={() => onSave({ ...settings, themeMode: t as any })}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <label className="settings-label">Accent Palette</label>
              <div className="settings-method-grid" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#d4a843', '#ffffff', '#2ecc71', '#1abc9c', '#3498db', '#e74c3c', '#9b59b6', '#f39c12'].map(color => (
                  <button key={color} onClick={() => onSave({ ...settings, themeAccent: color })} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: color, border: settings.themeAccent === color ? '2px solid white' : '2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="settings-grid">
            <div className="settings-section">
              <label className="settings-label">Personalization</label>
              <input className="settings-input" style={{ paddingLeft: '16px' }} value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we address you?" />
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
                <input type="checkbox" checked={settings.clockShowSeconds} onChange={(e) => onSave({ ...settings, clockShowSeconds: e.target.checked })} style={{ marginRight: '8px' }} /> Show Seconds
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
                <img src="/icons/icon128.png" alt="5PrayerTab Logo" className="about-logo" onError={(e) => e.currentTarget.style.display = 'none'} />
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

      {(tab === 'settings') && (
        <div className="settings-footer">
          <button className="settings-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="settings-save-btn" onClick={() => { save(); onClose(); }}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ activeTab, settings, onSave, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const dialog = overlay.querySelector<HTMLElement>('[data-settings-dialog="true"]');
    if (!dialog) return;

    const focusables = dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      dialog.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const currentDialog = overlay.querySelector<HTMLElement>('[data-settings-dialog="true"]');
      if (!currentDialog) return;

      const currentFocusables = currentDialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (currentFocusables.length === 0) {
        event.preventDefault();
        currentDialog.focus();
        return;
      }

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previousFocusedRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="settings-overlay"
      ref={overlayRef}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {activeTab === 'background' ? (
        <BackgroundSettings settings={settings} onSave={onSave} onClose={onClose} />
      ) : (
        <GeneralSettings tab={activeTab} settings={settings} onSave={onSave} onClose={onClose} />
      )}
    </div>
  );
};

export default SettingsPanel;
