import type { UserSettings } from '../types';

export interface WidgetComponentProps {
  sizeTier: 'small' | 'medium' | 'large';
  isEditMode: boolean;
  settings: UserSettings;
}
