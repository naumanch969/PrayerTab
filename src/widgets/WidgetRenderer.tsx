import React from 'react';
import type { UserSettings, WidgetId } from '../types';
import { WIDGET_COMPONENTS } from './registry';

interface WidgetRendererProps {
  widgetId: WidgetId;
  sizeTier: 'small' | 'medium' | 'large';
  isEditMode: boolean;
  settings: UserSettings;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widgetId, sizeTier, isEditMode, settings }) => {
  const Component = WIDGET_COMPONENTS[widgetId];
  if (!Component) return null;

  return (
    <div className={`widget-body ${isEditMode ? 'is-editing' : ''}`}>
      <Component sizeTier={sizeTier} isEditMode={isEditMode} settings={settings} />
    </div>
  );
};
