/**
 * Prayer time calculation engine.
 * Based on the Adhan calculation method (same algorithm as adhan-js).
 * All functions are pure; no side effects.
 */

import type { CalculationMethod, Location, PrayerTimes } from '../types';

interface AlAdhanResponse {
  data?: {
    timings?: Record<string, string>;
  };
}

// ── Trig helpers ──────────────────────────────────────────────────────────────

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

function fixAngle(a: number): number {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
}

function fixHour(a: number): number {
  a = a - 24 * Math.floor(a / 24);
  return a < 0 ? a + 24 : a;
}

// ── Solar calculations ────────────────────────────────────────────────────────

function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd: number): { declination: number; equation: number } {
  const D = jd - 2451545;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(toRad(g)) + 0.02 * Math.sin(toRad(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const declination = toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(L))));
  const RA = toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15;
  const equation = q / 15 - fixHour(RA);
  return { declination, equation };
}

function computeTime(
  angle: number,
  latitude: number,
  declination: number,
  equation: number,
  direction: 'ccw' | 'cw' = 'ccw',
): number {
  const cosT =
    (Math.cos(toRad(angle)) -
      Math.sin(toRad(latitude)) * Math.sin(toRad(declination))) /
    (Math.cos(toRad(latitude)) * Math.cos(toRad(declination)));

  if (cosT < -1) return direction === 'ccw' ? 0 : 24; // polar night
  if (cosT > 1) return direction === 'ccw' ? 24 : 0;  // polar day

  const T = toDeg(Math.acos(cosT)) / 15;
  return direction === 'ccw' ? 12 - T - equation : 12 + T - equation;
}

// ── Method parameters ─────────────────────────────────────────────────────────

interface MethodParams {
  fajrAngle: number;
  ishaAngle: number;
  ishaInterval?: number; // minutes after Maghrib (Makkah)
  midnight?: 'Standard' | 'Jafari';
}

const METHOD_PARAMS: Record<CalculationMethod, MethodParams> = {
  MWL:    { fajrAngle: 18,   ishaAngle: 17 },
  ISNA:   { fajrAngle: 15,   ishaAngle: 15 },
  Egypt:  { fajrAngle: 19.5, ishaAngle: 17.5 },
  Makkah: { fajrAngle: 18.5, ishaAngle: 0, ishaInterval: 90, midnight: 'Standard' },
  Karachi:{ fajrAngle: 18,   ishaAngle: 18 },
  Tehran: { fajrAngle: 17.7, ishaAngle: 14, midnight: 'Jafari' },
  Shia:   { fajrAngle: 16,   ishaAngle: 14, midnight: 'Jafari' },
} as const;

// ── Main calculation ──────────────────────────────────────────────────────────

function hoursToDate(hours: number, date: Date, timezone: number): Date {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const utcHours = hours - timezone;
  day.setTime(day.getTime() + utcHours * 3_600_000);
  return day;
}

export function calculatePrayerTimes(
  date: Date,
  location: Location,
  method: CalculationMethod,
): PrayerTimes {
  const { latitude, longitude } = location;
  const timezone = -date.getTimezoneOffset() / 60;

  // Use UTC noon at the given longitude to determine the Julian date
  const jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) - longitude / (15 * 24);
  const { declination, equation } = sunPosition(jd);

  const params = METHOD_PARAMS[method] ?? METHOD_PARAMS.MWL;

  // Zenith angles
  const ZENITH_TRANSIT = 0;
  const ZENITH_SUNRISE_SUNSET = 0.833;
  const ZENITH_ASR_SHAFI = 1; // shadow length = 1× object height

  const transit   = computeTime(-ZENITH_TRANSIT,         latitude, declination, equation);
  const sunrise   = computeTime(ZENITH_SUNRISE_SUNSET,   latitude, declination, equation, 'ccw');
  const sunset    = computeTime(ZENITH_SUNRISE_SUNSET,   latitude, declination, equation, 'cw');

  // Asr: time when shadow = factor × height + noon shadow
  const asrAngle = toDeg(
    Math.atan(1 / (ZENITH_ASR_SHAFI + Math.tan(toRad(Math.abs(latitude - declination))))),
  );
  const asr = computeTime(-asrAngle, latitude, declination, equation, 'cw');

  const fajr = computeTime(params.fajrAngle, latitude, declination, equation, 'ccw');
  const isha = params.ishaInterval
    ? sunset + params.ishaInterval / 60
    : computeTime(params.ishaAngle, latitude, declination, equation, 'cw');

  return {
    Fajr:    hoursToDate(fajr,    date, timezone),
    Sunrise: hoursToDate(sunrise, date, timezone),
    Dhuhr:   hoursToDate(transit + 0.0167 /* 1 min */ , date, timezone),
    Asr:     hoursToDate(asr,     date, timezone),
    Maghrib: hoursToDate(sunset,  date, timezone),
    Isha:    hoursToDate(isha,    date, timezone),
  };
}

export function getNextPrayer(times: PrayerTimes): { name: string; time: Date } | null {
  const now = Date.now();
  const ordered: [string, Date][] = [
    ['Fajr',    times.Fajr],
    ['Dhuhr',   times.Dhuhr],
    ['Asr',     times.Asr],
    ['Maghrib', times.Maghrib],
    ['Isha',    times.Isha],
  ];
  for (const [name, time] of ordered) {
    if (time.getTime() > now) return { name, time };
  }
  return null; // All prayers for today have passed
}

export function formatCountdown(targetTime: Date): string {
  const diffMs = targetTime.getTime() - Date.now();
  if (diffMs <= 0) return '00:00:00';
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function mapCalculationMethodToAlAdhan(method: CalculationMethod): number {
  switch (method) {
    case 'Karachi':
      return 1;
    case 'ISNA':
      return 2;
    case 'MWL':
      return 3;
    case 'Makkah':
      return 4;
    case 'Egypt':
      return 5;
    case 'Tehran':
      return 7;
    case 'Shia':
      return 0;
    default:
      return 3;
  }
}

function dateToApiFormat(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function parseApiTime(raw: string, date: Date): Date {
  // AlAdhan can return values like "05:10" or "05:10 (+05)".
  const match = raw.match(/(\d{1,2}):(\d{2})/);
  const hours = match ? Number(match[1]) : 0;
  const minutes = match ? Number(match[2]) : 0;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

function getPrayerCacheKey(date: Date, location: Location, method: CalculationMethod): string {
  const dateKey = date.toISOString().slice(0, 10);
  const lat = location.latitude.toFixed(3);
  const lon = location.longitude.toFixed(3);
  return `prayer-times:${dateKey}:${lat}:${lon}:${method}`;
}

export async function fetchPrayerTimesFromApi(
  date: Date,
  location: Location,
  method: CalculationMethod,
): Promise<PrayerTimes | null> {
  const cacheKey = getPrayerCacheKey(date, location, method);
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as PrayerTimes;
      return {
        Fajr: new Date(parsed.Fajr),
        Sunrise: new Date(parsed.Sunrise),
        Dhuhr: new Date(parsed.Dhuhr),
        Asr: new Date(parsed.Asr),
        Maghrib: new Date(parsed.Maghrib),
        Isha: new Date(parsed.Isha),
      };
    } catch {
      // Ignore invalid cache and fetch fresh data.
    }
  }

  try {
    const methodId = mapCalculationMethodToAlAdhan(method);
    const school = method === 'Karachi' ? 1 : 0;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateParam = dateToApiFormat(date);

    const url = new URL(`https://api.aladhan.com/v1/timings/${dateParam}`);
    url.searchParams.set('latitude', String(location.latitude));
    url.searchParams.set('longitude', String(location.longitude));
    url.searchParams.set('method', String(methodId));
    url.searchParams.set('school', String(school));
    url.searchParams.set('timezonestring', timezone);

    const response = await fetch(url.toString());
    if (!response.ok) return null;

    const payload = (await response.json()) as AlAdhanResponse;
    const timings = payload.data?.timings;
    if (!timings) return null;

    const times: PrayerTimes = {
      Fajr: parseApiTime(timings.Fajr ?? '00:00', date),
      Sunrise: parseApiTime(timings.Sunrise ?? '00:00', date),
      Dhuhr: parseApiTime(timings.Dhuhr ?? '00:00', date),
      Asr: parseApiTime(timings.Asr ?? '00:00', date),
      Maghrib: parseApiTime(timings.Maghrib ?? timings.Sunset ?? '00:00', date),
      Isha: parseApiTime(timings.Isha ?? '00:00', date),
    };

    localStorage.setItem(cacheKey, JSON.stringify(times));
    return times;
  } catch {
    return null;
  }
}
