import React from 'react';
import './prayer-streak/styles.css';
import type { WidgetComponentProps } from '../types';

const PRAYERS: Array<{ key: keyof Omit<NonNullable<WidgetComponentProps['runtime']['todayLog']>, 'date'>; label: string }> = [
  { key: 'Fajr', label: 'F' },
  { key: 'Dhuhr', label: 'D' },
  { key: 'Asr', label: 'A' },
  { key: 'Maghrib', label: 'M' },
  { key: 'Isha', label: 'I' },
];

const PrayerStreakWidget: React.FC<WidgetComponentProps> = ({ runtime, isEditMode }) => {
  const streak = runtime.streak;
  const completedToday = runtime.todayLog
    ? PRAYERS.filter((prayer) => runtime.todayLog?.[prayer.key] === 'completed').length
    : 0;

  return (
    <div className="sample-widget sample-streak">
      <div className="sample-widget-label">Prayer Streak</div>
      <div className="sample-streak-head">
        <span className="sample-streak-value">{streak}</span>
        <span className="sample-widget-sub">days</span>
      </div>
      <div className="sample-widget-sub">Today: {completedToday}/5 completed</div>
      <div className="sample-streak-days">
        {PRAYERS.map((prayer) => {
          const status = runtime.todayLog?.[prayer.key] ?? 'pending';
          const completed = status === 'completed';

          return (
          <span
            key={prayer.key}
            className={completed ? 'on' : 'today'}
            onClick={() => {
              if (isEditMode) return;
              void runtime.togglePrayer(prayer.key, status);
            }}
          >
            <small>{prayer.label}</small>
            <i>{completed ? '✓' : '·'}</i>
          </span>
        );
        })}
      </div>
    </div>
  );
};

export default PrayerStreakWidget;
