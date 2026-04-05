import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Search, UploadCloud, X } from 'lucide-react';
import type { BackgroundSource, UserSettings } from '../../types';
import {
  BG_SIDEBAR_ITEMS,
  GRADIENTS,
  HEX_COLOR_PATTERN,
  MOCK_CATEGORIES,
  SOLID_COLORS,
  getInitialGradientColors,
  getInitialSolidColor,
} from './constants';

interface BackgroundSettingsProps {
  settings: UserSettings;
  onSave: (u: UserSettings) => void;
  onClose: () => void;
}

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({ settings, onSave, onClose }) => {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      onClick={(event) => event.stopPropagation()}
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
              );
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
                onChange={(event) => handleOpacityChange(parseInt(event.target.value, 10))}
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
                {MOCK_CATEGORIES.map((category) => (
                  <div key={category.name} className="bg-category">
                    <div className="bg-category-title">{category.name}</div>
                    <div className="bg-category-grid">
                      {category.items.map((item) => (
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
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') performSearch();
                    }}
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
                    searchResults.map((url) => (
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
                    onChange={(event) => setManualUrl(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') applyManualUrl();
                    }}
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
                    {SOLID_COLORS.map((color) => (
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
                        onChange={(event) => applyCustomSolid(event.target.value)}
                        style={{ width: '48px', height: '40px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', padding: '4px', cursor: 'pointer' }}
                      />
                      <input
                        className="settings-input"
                        value={customSolidColor}
                        onChange={(event) => setCustomSolidColor(event.target.value)}
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
                    {GRADIENTS.map((gradient, i) => (
                      <div key={gradient} className="bg-category-card" onClick={() => handleSelectBg(gradient, 'gradient')}>
                        <div className={`bg-category-img ${bgUrl === gradient && bgSource === 'gradient' ? 'active' : ''}`} style={{ backgroundImage: gradient }}>
                          {bgUrl === gradient && bgSource === 'gradient' && <div className="bg-preset-check">✓</div>}
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
                          onChange={(event) => {
                            const next = event.target.value;
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
                          onChange={(event) => {
                            const next = event.target.value;
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
                    <div className="bg-category-img" style={{ backgroundImage: `url(${bgUrl})`, height: '240px', width: '100%', marginTop: '12px', cursor: 'default' }} />
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

export default BackgroundSettings;
