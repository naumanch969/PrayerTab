/**
 * usePrayerTimes — loads today's prayer times from location + calculation method.
 * Refreshes at midnight to pick up the next day's times.
 */

import { useState, useEffect } from 'react';
import { calculatePrayerTimes, getNextPrayer, formatCountdown } from '../lib/prayerTimes';
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

  // Recompute prayer times whenever location or method changes, or at midnight
  useEffect(() => {
    if (!location) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const getPrayerSnapshot = (baseDate: Date) => {
      const times = calculatePrayerTimes(baseDate, location, method);
      const upcoming = getNextPrayer(times);

      if (upcoming) {
        return { times, nextPrayer: upcoming };
      }

      const tomorrow = new Date(baseDate);
      tomorrow.setDate(baseDate.getDate() + 1);
      const tomorrowTimes = calculatePrayerTimes(tomorrow, location, method);
      return {
        times,
        nextPrayer: { name: 'Fajr', time: tomorrowTimes.Fajr },
      };
    };

    const compute = () => {
      const { times, nextPrayer } = getPrayerSnapshot(new Date());
      setState({
        times,
        nextPrayer,
        countdown: nextPrayer ? formatCountdown(nextPrayer.time) : '--:--:--',
        loading: false,
      });
    };

    compute();

    // Tick the countdown every second
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.nextPrayer) return prev;
        const stillNext = prev.nextPrayer.time.getTime() > Date.now();
        if (!stillNext) {
          const { times, nextPrayer } = getPrayerSnapshot(new Date());
          return {
            ...prev,
            times,
            nextPrayer,
            countdown: nextPrayer ? formatCountdown(nextPrayer.time) : '--:--:--',
          };
        }
        return { ...prev, countdown: formatCountdown(prev.nextPrayer.time) };
      });
    }, 1000);

    // Recompute at midnight
    const now = new Date();
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const midnightTimeout = setTimeout(compute, msToMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, [location, method]);

  return state;
}
