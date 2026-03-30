/**
 * Hijri (Islamic) calendar conversion.
 * Uses the Umm al-Qura algorithm (tabular method).
 */

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) { year--; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524;
}

export function toHijri(gregorian: Date): HijriDate {
  const year  = gregorian.getFullYear();
  const month = gregorian.getMonth() + 1;
  const day   = gregorian.getDate();

  const jd = julianDay(year, month, day);
  const l  = jd - 1948440 + 10632;
  const n  = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j  =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay   = l3 - Math.floor((709 * hMonth) / 24);
  const hYear  = 30 * n + j - 30;

  return {
    day:       hDay,
    month:     hMonth,
    year:      hYear,
    monthName: HIJRI_MONTHS[hMonth - 1] ?? '',
  };
}

export function isRamadan(date: Date): boolean {
  return toHijri(date).month === 9;
}

export function formatHijri(h: HijriDate): string {
  return `${h.day} ${h.monthName} ${h.year} AH`;
}
