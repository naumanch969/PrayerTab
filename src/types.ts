// ── Prayer Times ────────────────────────────────────────────────────────────

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type WidgetId =
  | 'prayer-times'
  | 'next-prayer'
  | 'hijri-date'
  | 'clock'
  | 'daily-ayah'
  | 'focus-task'
  | 'dhikr-counter'
  | 'prayer-streak'
  | 'qibla-compass'
  | 'weather'
  | 'tasbeeh'
  | 'ramadan-countdown'
  | 'bookmarks'
  | 'note';

export type CalculationMethod =
  | 'MWL'
  | 'ISNA'
  | 'Egypt'
  | 'Makkah'
  | 'Karachi'
  | 'Tehran'
  | 'Shia';

export interface PrayerTime {
  name: PrayerName;
  time: Date;
  unix: number;
}

export interface PrayerTimes {
  Fajr: Date;
  Sunrise: Date;
  Dhuhr: Date;
  Asr: Date;
  Maghrib: Date;
  Isha: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
}

// ── Quran ────────────────────────────────────────────────────────────────────

export interface Ayah {
  arabic: string;
  translation: string;
  surah: string;
  ayahNumber: number;
}

// ── User Settings ────────────────────────────────────────────────────────────

export interface UserSettings {
  name: string;
  calculationMethod: CalculationMethod;
  location: Location | null;
  onboardingComplete: boolean;
  hasSeenCustomizePrompt: boolean;
  enabledWidgets: WidgetId[];
}

// ── Streak & Prayer Log ───────────────────────────────────────────────────────

export type PrayerStatus = 'pending' | 'completed' | 'missed';

export interface DailyPrayerLog {
  date: string; // ISO date string YYYY-MM-DD
  Fajr: PrayerStatus;
  Dhuhr: PrayerStatus;
  Asr: PrayerStatus;
  Maghrib: PrayerStatus;
  Isha: PrayerStatus;
}

// ── Dhikr ────────────────────────────────────────────────────────────────────

export type DhikrType = 'Subhanallah' | 'Alhamdulillah' | 'AllahuAkbar';

export interface DhikrState {
  current: DhikrType;
  counts: Record<DhikrType, number>;
  date: string;
}

// ── Intention ────────────────────────────────────────────────────────────────

export interface Intention {
  text: string;
  date: string; // YYYY-MM-DD clears at midnight
}

// ── App State (persisted in chrome.storage.local) ────────────────────────────

export interface AppStorage {
  settings: UserSettings;
  prayerLogs: DailyPrayerLog[];
  dhikr: DhikrState;
  intention: Intention;
}
