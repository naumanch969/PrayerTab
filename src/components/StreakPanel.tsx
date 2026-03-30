import React from 'react';
import type { DailyPrayerLog } from '../types';

interface StreakPanelProps {
  streak: number;
  todayLog: DailyPrayerLog | null;
}

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

const StreakPanel: React.FC<StreakPanelProps> = ({ streak, todayLog }) => {
  const completedToday = todayLog
    ? PRAYER_NAMES.filter((p) => todayLog[p] === 'completed').length
    : 0;

  return (
    <div className="streak-panel">
      <div className="panel-section-label">Prayer Streak</div>

      <div className="streak-display">
        <span className="streak-flame">🔥</span>
        <span className="streak-number">{streak}</span>
        <span className="streak-unit">day{streak !== 1 ? 's' : ''}</span>
      </div>

      <div className="streak-today">
        <div className="streak-today-label">Today</div>
        <div className="streak-today-pips">
          {PRAYER_NAMES.map((name) => (
            <div
              key={name}
              className={`streak-pip ${todayLog?.[name] === 'completed' ? 'done' : ''}`}
              title={name}
            />
          ))}
        </div>
        <div className="streak-today-count">{completedToday}/5 prayed</div>
      </div>
    </div>
  );
};

export default StreakPanel;
