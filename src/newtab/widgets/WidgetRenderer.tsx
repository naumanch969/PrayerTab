import React from 'react';
import type { WidgetRuntimeData } from './types';
import { WIDGET_COMPONENTS } from './registry';
import { UserSettings, WidgetId } from '../../types';

interface WidgetRendererProps {
  widgetId: WidgetId;
  sizeTier: 'small' | 'medium' | 'large';
  isEditMode: boolean;
  settings: UserSettings;
  runtime: WidgetRuntimeData;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widgetId, sizeTier, isEditMode, settings, runtime }) => {
  const Component = WIDGET_COMPONENTS[widgetId];
  if (!Component) return null;

  return (
    <div className={`widget-body ${isEditMode ? 'is-editing' : ''}`}>
      <Component sizeTier={sizeTier} isEditMode={isEditMode} settings={settings} runtime={runtime} />
    </div>
  );
};
