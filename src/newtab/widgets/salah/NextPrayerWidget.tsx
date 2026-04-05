import React from 'react';
import './next-prayer/styles.css';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const NextPrayerWidget: React.FC<WidgetComponentProps> = ({ settings, sizeTier }) => {
  const { nextPrayer, countdown, loading, times } = usePrayerTimes(settings.location, settings.calculationMethod);

  if (loading) return <div className="widget-body-empty">Calculating...</div>;
  if (!nextPrayer) return <div className="widget-body-empty">Set location</div>;

  const parts = countdown.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  const seconds = parts[2] ?? 0;

  const orderedPrayerNames: Array<'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const nextIdx = orderedPrayerNames.findIndex((name) => name === nextPrayer.name);
  const prevIdx = nextIdx <= 0 ? orderedPrayerNames.length - 1 : nextIdx - 1;
  const prevName = orderedPrayerNames[prevIdx];
  const prevTime = times?.[prevName] ?? new Date(Date.now() - 6 * 60 * 60 * 1000);
  const totalWindow = Math.max(1, nextPrayer.time.getTime() - prevTime.getTime());
  const elapsed = Math.max(0, Date.now() - prevTime.getTime());
  const progressPct = Math.max(0, Math.min(100, (elapsed / totalWindow) * 100));

  const formattedNextTime = nextPrayer.time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.clockFormat === '12h',
  });

  if (sizeTier === 'small') {
    return (
      <div className="salah-next-widget small">
        <div className="salah-next-name">{nextPrayer.name}</div>
        <div className="salah-next-countdown">{countdown}</div>
        <div className="salah-next-chip">at {formattedNextTime}</div>
      </div>
    );
  }

  return (
    <div className={`salah-next-widget ${sizeTier}`}>
      <div className="salah-next-head">
        <span className="salah-next-kicker">Next Prayer</span>
        <span className="salah-next-at">{formattedNextTime}</span>
      </div>

      <div className="salah-next-name">{nextPrayer.name}</div>

      <div className="salah-next-countdown-block">
        <span className="salah-next-seg">{String(hours).padStart(2, '0')}</span>
        <span className="salah-next-sep">:</span>
        <span className="salah-next-seg">{String(minutes).padStart(2, '0')}</span>
        <span className="salah-next-sep">:</span>
        <span className="salah-next-seg">{String(seconds).padStart(2, '0')}</span>
      </div>

      <div className="salah-next-track">
        <span style={{ width: `${progressPct}%` }} />
      </div>

      {sizeTier === 'large' && (
        <div className="salah-next-breakdown">
          <span>From {prevName}</span>
          <span>{hours}h {minutes}m left</span>
        </div>
      )}
    </div>
  );
};

export default NextPrayerWidget;
