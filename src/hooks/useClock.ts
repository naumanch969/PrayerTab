/**
 * useClock — provides current time, updated every second.
 */

import { useState, useEffect } from 'react';

interface ClockState {
  now: Date;
  timeString: string;
  greeting: string;
}

function getGreeting(hour: number): string {
  if (hour >= 4 && hour < 12) return 'Sabah Al-Khayr'; // Good morning
  if (hour >= 12 && hour < 16) return 'Nahar Sa\'id';   // Good afternoon
  if (hour >= 16 && hour < 20) return 'Masa\' Al-Khayr'; // Good evening
  return 'Tisbah \'ala Khayr';                           // Good night
}

export function useClock(): ClockState {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return { now, timeString, greeting: getGreeting(now.getHours()) };
}
