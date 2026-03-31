import type { WidgetId } from '../types';
import type { WidgetComponentProps } from './types';

import PrayerTimesWidget from './salah/PrayerTimesWidget';
import NextPrayerWidget from './salah/NextPrayerWidget';
import HijriDateWidget from './salah/HijriDateWidget';
import QiblaCompassWidget from './salah/QiblaCompassWidget';
import RamadanCountdownWidget from './salah/RamadanCountdownWidget';

import DailyAyahWidget from './reflection/DailyAyahWidget';
import DhikrCounterWidget from './reflection/DhikrCounterWidget';
import TasbeehWidget from './reflection/TasbeehWidget';

import ClockWidget from './focus/ClockWidget';
import FocusTaskWidget from './focus/FocusTaskWidget';
import PrayerStreakWidget from './focus/PrayerStreakWidget';

import WeatherWidget from './utility/WeatherWidget';
import BookmarksWidget from './utility/BookmarksWidget';
import NoteWidget from './utility/NoteWidget';

import type React from 'react';

export const WIDGET_COMPONENTS: Record<WidgetId, React.FC<WidgetComponentProps>> = {
  'prayer-times': PrayerTimesWidget,
  'next-prayer': NextPrayerWidget,
  'hijri-date': HijriDateWidget,
  'qibla-compass': QiblaCompassWidget,
  'ramadan-countdown': RamadanCountdownWidget,
  'daily-ayah': DailyAyahWidget,
  'dhikr-counter': DhikrCounterWidget,
  tasbeeh: TasbeehWidget,
  clock: ClockWidget,
  'focus-task': FocusTaskWidget,
  'prayer-streak': PrayerStreakWidget,
  weather: WeatherWidget,
  bookmarks: BookmarksWidget,
  note: NoteWidget,
};
