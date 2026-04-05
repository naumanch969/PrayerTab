import React from 'react';
import type { UserSettings } from '../types';
import BackgroundSettings from './settings/BackgroundSettings';
import GeneralSettings from './settings/GeneralSettings';
import { useDialogFocusTrap } from './settings/useDialogFocusTrap';

interface SettingsPanelProps {
  activeTab: string;
  settings: UserSettings;
  onSave: (updated: UserSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ activeTab, settings, onSave, onClose }) => {
  const overlayRef = useDialogFocusTrap(onClose);

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
