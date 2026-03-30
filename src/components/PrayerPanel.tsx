import React from 'react';
import { formatTime } from '../lib/prayerTimes';
import type { PrayerTimes, DailyPrayerLog, PrayerStatus } from '../types';

interface PrayerPanelProps {
  times: PrayerTimes | null;
  todayLog: DailyPrayerLog | null;
  nextPrayerName: string | null;
  countdown: string;
  loading: boolean;
  onToggle: (name: keyof Omit<DailyPrayerLog, 'date'>, status: PrayerStatus) => void;
}

type DisplayPrayer = { name: keyof Omit<DailyPrayerLog, 'date'>; label: string; arabicName: string };

const DISPLAY_PRAYERS: DisplayPrayer[] = [
  { name: 'Fajr',    label: 'Fajr',    arabicName: 'الفجر' },
  { name: 'Dhuhr',   label: 'Dhuhr',   arabicName: 'الظهر' },
  { name: 'Asr',     label: 'Asr',     arabicName: 'العصر' },
  { name: 'Maghrib', label: 'Maghrib', arabicName: 'المغرب' },
  { name: 'Isha',    label: 'Isha',    arabicName: 'العشاء' },
];

const PrayerPanel: React.FC<PrayerPanelProps> = ({
  times, todayLog, nextPrayerName, countdown, loading, onToggle,
}) => {
  if (loading) {
    return (
      <div className="prayer-panel">
        <div className="prayer-skeleton" />
      </div>
    );
  }

  if (!times) {
    return (
      <div className="prayer-panel prayer-no-location">
        <div className="panel-section-label">Prayer Times</div>
        <p className="prayer-no-loc-text">Location required to calculate prayer times.</p>
      </div>
    );
  }

  return (
    <div className="prayer-panel">
      <div className="panel-section-label">Prayer Times</div>

      {nextPrayerName && (
        <div className="next-prayer-badge">
          <span className="next-label">Next · {nextPrayerName}</span>
          <span className="next-countdown">{countdown}</span>
        </div>
      )}

      <div className="prayer-list">
        {DISPLAY_PRAYERS.map(({ name, label, arabicName }) => {
          const time = times[name === 'Fajr' ? 'Fajr' : name === 'Dhuhr' ? 'Dhuhr' : name === 'Asr' ? 'Asr' : name === 'Maghrib' ? 'Maghrib' : 'Isha'];
          const status = todayLog?.[name] ?? 'pending';
          const isNext = nextPrayerName === label;
          const isPast = time.getTime() < Date.now() && !isNext;

          return (
            <div
              key={name}
              className={`prayer-row ${isNext ? 'is-next' : ''} ${isPast ? 'is-past' : ''}`}
              onClick={() => onToggle(name, status)}
            >
              <div className="prayer-names">
                <span className="prayer-english">{label}</span>
                <span className="prayer-arabic">{arabicName}</span>
              </div>
              <span className="prayer-time">{formatTime(time)}</span>
              <span className={`prayer-check ${status === 'completed' ? 'done' : ''}`}>
                {status === 'completed' ? '✓' : '○'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerPanel;
