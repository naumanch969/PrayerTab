import React from 'react';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const PrayerTimesWidget: React.FC<WidgetComponentProps> = ({ settings }) => {
  const { times, nextPrayer, countdown, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

  if (loading) {
    return <div className="widget-body-empty">Loading salah...</div>;
  }

  if (!times) {
    return <div className="widget-body-empty">Set location</div>;
  }

  const rows = [
    ['Fajr', times.Fajr],
    ['Dhuhr', times.Dhuhr],
    ['Asr', times.Asr],
    ['Maghrib', times.Maghrib],
    ['Isha', times.Isha],
  ] as const;

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const now = Date.now();
  const nextName = nextPrayer?.name as (typeof rows)[number][0] | undefined;
  const nextIndex = rows.findIndex(([name]) => name === nextName);
  const prevIndex = nextIndex <= 0 ? rows.length - 1 : nextIndex - 1;
  const prevAt = rows[prevIndex]?.[1]?.getTime?.() ?? now;
  const nextAt = nextPrayer?.time.getTime() ?? now + 1;
  const progress = Math.max(0, Math.min(100, ((now - prevAt) / Math.max(nextAt - prevAt, 1)) * 100));

  return (
    <div className="sample-widget sample-prayer-times">
      <div className="sample-widget-label">Prayer Times</div>
      <div className="sample-prayer-times-grid">
        {rows.map(([name, time]) => (
          <div key={name} className={`sample-prayer-row ${nextPrayer?.name === name ? 'active' : ''}`}>
            <span className="sample-prayer-name">{name}</span>
            <span className="sample-prayer-time">{formatTime(time)}</span>
          </div>
        ))}
      </div>
      <div className="sample-progress-bar"><span style={{ width: `${progress}%` }} /></div>
      <div className="sample-prayer-range">
        <span>{rows[prevIndex]?.[0] ?? ''}</span>
        <span>{nextPrayer?.name ?? ''}</span>
      </div>
      {nextPrayer && (
        <div className="sample-next-badge">
          <span>{nextPrayer.name} in</span>
          <strong>{countdown}</strong>
        </div>
      )}
    </div>
  );
};

export default PrayerTimesWidget;
