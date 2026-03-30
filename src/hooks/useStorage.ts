/**
 * useStorage — loads and manages persisted app state.
 * Single source of truth for settings, prayer logs, dhikr, intention.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getSettings, saveSettings,
  getPrayerLogs, getTodayLog, markPrayer, calculateStreak,
  getDhikr, saveDhikr, incrementDhikr,
  getIntention, saveIntention,
} from '../lib/storage';
import type {
  UserSettings, DailyPrayerLog, DhikrState, Intention, PrayerStatus,
} from '../types';

interface StorageState {
  settings: UserSettings | null;
  todayLog: DailyPrayerLog | null;
  streak: number;
  dhikr: DhikrState | null;
  intention: Intention | null;
  loading: boolean;
}

interface StorageActions {
  updateSettings: (s: UserSettings) => Promise<void>;
  togglePrayer: (name: keyof Omit<DailyPrayerLog, 'date'>, status: PrayerStatus) => Promise<void>;
  tapDhikr: () => Promise<void>;
  setIntention: (text: string) => Promise<void>;
}

export function useStorage(): StorageState & StorageActions {
  const [state, setState] = useState<StorageState>({
    settings: null,
    todayLog: null,
    streak: 0,
    dhikr: null,
    intention: null,
    loading: true,
  });

  useEffect(() => {
    Promise.all([
      getSettings(),
      getTodayLog(),
      getPrayerLogs(),
      getDhikr(),
      getIntention(),
    ]).then(([settings, todayLog, logs, dhikr, intention]) => {
      setState({
        settings,
        todayLog,
        streak: calculateStreak(logs),
        dhikr,
        intention,
        loading: false,
      });
    });
  }, []);

  const updateSettings = useCallback(async (settings: UserSettings) => {
    await saveSettings(settings);
    setState((s) => ({ ...s, settings }));
  }, []);

  const togglePrayer = useCallback(
    async (name: keyof Omit<DailyPrayerLog, 'date'>, status: PrayerStatus) => {
      const newStatus = status === 'completed' ? 'pending' : 'completed';
      const updatedLog = await markPrayer(name, newStatus);
      const logs = await getPrayerLogs();
      setState((s) => ({
        ...s,
        todayLog: updatedLog,
        streak: calculateStreak(logs),
      }));
    },
    [],
  );

  const tapDhikr = useCallback(async () => {
    setState((s) => {
      if (!s.dhikr) return s;
      const next = incrementDhikr(s.dhikr);
      saveDhikr(next);
      return { ...s, dhikr: next };
    });
  }, []);

  const setIntention = useCallback(async (text: string) => {
    await saveIntention(text);
    setState((s) => ({
      ...s,
      intention: { text, date: new Date().toISOString().slice(0, 10) },
    }));
  }, []);

  return { ...state, updateSettings, togglePrayer, tapDhikr, setIntention };
}
