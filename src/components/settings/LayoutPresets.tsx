import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { LayoutPreset, UserSettings } from '../../types';
import { SYSTEM_PRESETS } from '../../newtab/presets';

interface LayoutPresetsProps {
  settings: UserSettings;
  onSave: (u: UserSettings) => void;
}

const LayoutPresets: React.FC<LayoutPresetsProps> = ({ settings, onSave }) => {
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
      customPresets: settings.customPresets?.filter((preset) => preset.id !== id),
    });
  };

  return (
    <div className="settings-section">
      <label className="settings-label">Layout Presets</label>
      <div className="settings-method-grid">
        {SYSTEM_PRESETS.map((preset) => (
          <button key={preset.id} className="settings-method-btn" onClick={() => handleApply(preset)}>
            {preset.name}
          </button>
        ))}
      </div>

      {(settings.customPresets?.length ?? 0) > 0 && (
        <>
          <label className="settings-label" style={{ marginTop: '16px' }}>My Custom Presets</label>
          <div className="settings-method-grid">
            {settings.customPresets?.map((preset) => (
              <div key={preset.id} style={{ display: 'flex', gap: '4px' }}>
                <button className="settings-method-btn" style={{ flex: 1 }} onClick={() => handleApply(preset)}>
                  {preset.name}
                </button>
                <button className="settings-method-btn" style={{ width: '36px', padding: 0 }} onClick={() => handleDelete(preset.id)}>
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
              onChange={(event) => setNewPresetName(event.target.value)}
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

export default LayoutPresets;
