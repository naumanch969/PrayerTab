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

const PrayerStreakWidget: React.FC<WidgetComponentProps> = ({ runtime, isEditMode, sizeTier }) => {
  const streak = runtime.streak ?? 0;
  const completedToday = runtime.todayLog
    ? PRAYERS.filter((prayer) => runtime.todayLog?.[prayer.key] === 'completed').length
    : 0;

  return (
    <div className={`streak-widget ${sizeTier}`}>
      <div className="streak-head">
        <div className="streak-value-wrap">
          <span className="streak-number">{streak}</span>
          <span className="streak-days-label">Day streak</span>
        </div>

        <div className="streak-today-stat">{completedToday}/5 Today</div>
      </div>

      <div className="streak-interactive-grid" onPointerDown={(e) => e.stopPropagation()}>
        {PRAYERS.map((prayer) => {
          const status = runtime.todayLog?.[prayer.key] ?? 'pending';
          const isCompleted = status === 'completed';

          return (
            <button
              key={prayer.key}
              className={`streak-dot ${isCompleted ? 'completed' : ''}`}
              title={`${String(prayer.key)}: ${status}`}
              onClick={() => {
                if (isEditMode) return;
                void runtime.togglePrayer(prayer.key, status);
              }}
            >
              <span className="streak-dot-label">{prayer.label}</span>
              <div className="streak-dot-indicator">
                {isCompleted && <span className="streak-check">✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      {sizeTier === 'large' && <div className="streak-foot">Tap prayers to mark completion.</div>}
    </div>
  );
};


export default PrayerStreakWidget;
