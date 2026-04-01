/**
 * Chrome storage adapter.
 * Wraps chrome.storage.local with typed read/write, falling back to
 * localStorage for development mode (non-extension context).
 */

import type { AppStorage, UserSettings, DailyPrayerLog, DhikrState, DhikrType, Intention } from '../types';

const IS_EXTENSION = typeof chrome !== 'undefined' && !!chrome.storage;

// ── Low-level I/O ─────────────────────────────────────────────────────────────

function readRaw(key: string): Promise<unknown> {
  if (IS_EXTENSION) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => resolve(result[key]));
    });
  }
  const raw = localStorage.getItem(key);
  return Promise.resolve(raw ? JSON.parse(raw) : undefined);
}

function writeRaw(key: string, value: unknown): Promise<void> {
  if (IS_EXTENSION) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  localStorage.setItem(key, JSON.stringify(value));
  return Promise.resolve();
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const todayIso = () => new Date().toISOString().slice(0, 10);

const DEFAULT_DHIKR: DhikrState = {
  current: 'Subhanallah',
  counts: { Subhanallah: 0, Alhamdulillah: 0, AllahuAkbar: 0 },
  date: todayIso(),
};

const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  calculationMethod: 'MWL',
  location: null,
  onboardingComplete: false,
  hasSeenCustomizePrompt: false,
  clockFormat: '12h',
  clockShowSeconds: false,
  themeMode: 'glass',
  themeAccent: '#d4a843', // default gold
  fontFamily: 'inter',
  enabledWidgets: [],
  widgetLayouts: {},
  widgetPreferences: {},
};

const DEFAULT_INTENTION: Intention = { text: '', date: todayIso() };

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<UserSettings> {
  const stored = await readRaw('settings') as UserSettings | undefined;
  return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await writeRaw('settings', settings);
}

// ── Prayer Logs ───────────────────────────────────────────────────────────────

export async function getPrayerLogs(): Promise<DailyPrayerLog[]> {
  const stored = await readRaw('prayerLogs') as DailyPrayerLog[] | undefined;
  return stored ?? [];
}

async function savePrayerLogs(logs: DailyPrayerLog[]): Promise<void> {
  // Keep only last 90 days to avoid unbounded growth
  const trimmed = logs.slice(-90);
  await writeRaw('prayerLogs', trimmed);
}

export async function getTodayLog(): Promise<DailyPrayerLog> {
  const logs = await getPrayerLogs();
  const today = todayIso();
  return (
    logs.find((l) => l.date === today) ?? {
      date: today,
      Fajr: 'pending', Dhuhr: 'pending', Asr: 'pending',
      Maghrib: 'pending', Isha: 'pending',
    }
  );
}

export async function markPrayer(
  prayerName: keyof Omit<DailyPrayerLog, 'date'>,
  status: 'completed' | 'pending',
): Promise<DailyPrayerLog> {
  const logs = await getPrayerLogs();
  const today = todayIso();
  const existing = logs.findIndex((l) => l.date === today);
  const log =
    existing >= 0
      ? { ...logs[existing], [prayerName]: status }
      : {
          date: today,
          Fajr: 'pending' as const, Dhuhr: 'pending' as const,
          Asr: 'pending' as const, Maghrib: 'pending' as const,
          Isha: 'pending' as const, [prayerName]: status,
        };

  const updated =
    existing >= 0 ? logs.map((l, i) => (i === existing ? log : l)) : [...logs, log];

  await savePrayerLogs(updated);
  return log;
}

export function calculateStreak(logs: DailyPrayerLog[]): number {
  const prayers: (keyof Omit<DailyPrayerLog, 'date'>)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const allCompleted = (log: DailyPrayerLog) =>
    prayers.every((p) => log[p] === 'completed');

  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const log of sorted) {
    if (allCompleted(log)) streak++;
    else break;
  }
  return streak;
}

// ── Dhikr ─────────────────────────────────────────────────────────────────────

export async function getDhikr(): Promise<DhikrState> {
  const stored = await readRaw('dhikr') as DhikrState | undefined;
  if (!stored || stored.date !== todayIso()) return DEFAULT_DHIKR;
  return stored;
}

export async function saveDhikr(state: DhikrState): Promise<void> {
  await writeRaw('dhikr', state);
}

export function incrementDhikr(state: DhikrState): DhikrState {
  const MAX_COUNT = 33;
  const SEQUENCE: DhikrType[] = ['Subhanallah', 'Alhamdulillah', 'AllahuAkbar'];
  const newCount = state.counts[state.current] + 1;

  if (newCount >= MAX_COUNT) {
    const currentIdx = SEQUENCE.indexOf(state.current);
    const nextIdx = (currentIdx + 1) % SEQUENCE.length;
    const nextType = SEQUENCE[nextIdx];
    // If we've looped all 3, reset all counts
    const allCompleted = currentIdx === 2;
    return {
      current: allCompleted ? 'Subhanallah' : nextType,
      counts: allCompleted
        ? { Subhanallah: 0, Alhamdulillah: 0, AllahuAkbar: 0 }
        : { ...state.counts, [state.current]: MAX_COUNT },
      date: state.date,
    };
  }

  return { ...state, counts: { ...state.counts, [state.current]: newCount } };
}

export async function resetDhikr(): Promise<DhikrState> {
  const resetState = { ...DEFAULT_DHIKR, date: todayIso() };
  await saveDhikr(resetState);
  return resetState;
}

// ── Intention ────────────────────────────────────────────────────────────────

export async function getIntention(): Promise<Intention> {
  const stored = await readRaw('intention') as Intention | undefined;
  if (!stored || stored.date !== todayIso()) return DEFAULT_INTENTION;
  return stored;
}

export async function saveIntention(text: string): Promise<void> {
  await writeRaw('intention', { text, date: todayIso() });
}

// ── Data Portability (US-072) ────────────────────────────────────────────────

const EXPORT_VERSION = 1;

export interface ExportBundle {
  version: number;
  exportedAt: string;
  settings: UserSettings;
  prayerLogs: DailyPrayerLog[];
  dhikr: DhikrState;
  intention: Intention;
}

export async function exportAllData(): Promise<string> {
  const [settings, prayerLogs, dhikr, intention] = await Promise.all([
    getSettings(),
    getPrayerLogs(),
    getDhikr(),
    getIntention(),
  ]);

  const bundle: ExportBundle = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    prayerLogs,
    dhikr,
    intention,
  };

  return JSON.stringify(bundle, null, 2);
}

export async function importAllData(jsonString: string): Promise<void> {
  let bundle: ExportBundle;

  try {
    bundle = JSON.parse(jsonString) as ExportBundle;
  } catch {
    throw new Error('Invalid JSON — could not parse the import file.');
  }

  if (!bundle.version || !bundle.settings) {
    throw new Error('Unrecognised export format. Please use a valid 5PrayerTab export file.');
  }

  await Promise.all([
    saveSettings(bundle.settings),
    writeRaw('prayerLogs', bundle.prayerLogs ?? []),
    saveDhikr(bundle.dhikr ?? DEFAULT_DHIKR),
    writeRaw('intention', bundle.intention ?? DEFAULT_INTENTION),
  ]);
}
