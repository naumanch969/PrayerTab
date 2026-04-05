/**
 * usePrayerTimes — loads today's prayer times from location + calculation method.
 * Refreshes at midnight to pick up the next day's times.
 * Auto-detects geolocation if location is not provided.
 */

import { useState, useEffect, useRef } from 'react';
import {
  fetchPrayerTimesFromApi,
  getNextPrayer,
  formatCountdown,
} from '../lib/prayerTimes';
import { getUserLocation } from '../lib/geolocation';
import { getSettings, saveSettings } from '../lib/storage';
import type { PrayerTimes, Location, CalculationMethod } from '../types';

interface PrayerTimesState {
  times: PrayerTimes | null;
  nextPrayer: { name: string; time: Date } | null;
  countdown: string;
  loading: boolean;
}

export function usePrayerTimes(
  location: Location | null,
  method: CalculationMethod,
): PrayerTimesState {
  const [state, setState] = useState<PrayerTimesState>({
    times: null,
    nextPrayer: null,
    countdown: '--:--:--',
    loading: true,
  });

  const [autoLocation, setAutoLocation] = useState<Location | null>(location);
  const geoRequestAttempted = useRef(false);

  // Auto-detect location if not provided and save it
  useEffect(() => {
    if (!location && !geoRequestAttempted.current) {
      geoRequestAttempted.current = true;
      
      getUserLocation()
        .then(async (detectedLocation) => {
          console.log('🌍 Geolocation detected:', detectedLocation);
          
          // Save to storage immediately so it persists
          const settings = await getSettings();
          await saveSettings({
            ...settings,
            location: detectedLocation,
          });
          
          setAutoLocation(detectedLocation);
        })
        .catch((err) => {
          console.error('❌ Geolocation error:', err);
        });
    }
  }, [location]);

  // Recompute prayer times whenever location or method changes, or at midnight
  useEffect(() => {
    const effectLocation = location || autoLocation;
    
    if (!effectLocation) {
      console.log('⏳ Waiting for location...');
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const getPrayerSnapshot = async (baseDate: Date) => {
      const apiTimes = await fetchPrayerTimesFromApi(baseDate, effectLocation, method);
      if (!apiTimes) {
        return { times: null, nextPrayer: null };
      }

      const times = apiTimes;
      const upcoming = getNextPrayer(times);

      if (upcoming) {
        return { times, nextPrayer: upcoming };
      }

      const tomorrow = new Date(baseDate);
      tomorrow.setDate(baseDate.getDate() + 1);
      const tomorrowApiTimes = await fetchPrayerTimesFromApi(tomorrow, effectLocation, method);
      if (!tomorrowApiTimes) {
        return { times, nextPrayer: null };
      }

      const tomorrowTimes = tomorrowApiTimes;
      return {
        times,
        nextPrayer: { name: 'Fajr', time: tomorrowTimes.Fajr },
      };
    };

    const compute = async () => {
      const { times, nextPrayer } = await getPrayerSnapshot(new Date());
      setState({
        times,
        nextPrayer,
        countdown: nextPrayer ? formatCountdown(nextPrayer.time) : '--:--:--',
        loading: false,
      });
    };

    void compute();

    // Tick the countdown every second
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.nextPrayer) return prev;
        const stillNext = prev.nextPrayer.time.getTime() > Date.now();
        if (!stillNext) {
          void getPrayerSnapshot(new Date()).then(({ times, nextPrayer }) => {
            setState((current) => ({
              ...current,
              times,
              nextPrayer,
              countdown: nextPrayer ? formatCountdown(nextPrayer.time) : '--:--:--',
            }));
          });
          return prev;
        }
        return { ...prev, countdown: formatCountdown(prev.nextPrayer.time) };
      });
    }, 1000);

    // Recompute at midnight
    const now = new Date();
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const midnightTimeout = setTimeout(() => {
      void compute();
    }, msToMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, [location, autoLocation, method]);

  return state;
}
