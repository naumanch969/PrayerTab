import type { DailyPrayerLog, DhikrState, Intention, PrayerStatus, UserSettings } from '../types';

export interface WidgetRuntimeData {
  todayLog: DailyPrayerLog | null;
  streak: number;
  dhikr: DhikrState | null;
  intention: Intention | null;
  togglePrayer: (name: keyof Omit<DailyPrayerLog, 'date'>, status: PrayerStatus) => Promise<void>;
  tapDhikr: () => Promise<void>;
  setIntention: (text: string) => Promise<void>;
}

export interface WidgetComponentProps {
  sizeTier: 'small' | 'medium' | 'large';
  isEditMode: boolean;
  settings: UserSettings;
  runtime: WidgetRuntimeData;
}
