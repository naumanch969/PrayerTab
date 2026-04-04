import React from 'react';
import './prayer-times/styles.css';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const PrayerTimesWidget: React.FC<WidgetComponentProps> = ({ settings, sizeTier }) => {
  const { times, nextPrayer, countdown, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

  if (loading) {
    return <div className="widget-body-empty">Loading salah...</div>;
  }

  if (!times) {
    return <div className="widget-body-empty">Set location</div>;
  }

  const prayers = [
    { name: 'Fajr', time: times.Fajr },
    { name: 'Dhuhr', time: times.Dhuhr },
    { name: 'Asr', time: times.Asr },
    { name: 'Maghrib', time: times.Maghrib },
    { name: 'Isha', time: times.Isha },
  ];

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.clockFormat === '12h',
  });

  if (sizeTier === 'small') {
    return (
      <div className="prayer-widget-small">
        <div className="prayer-small-next">{nextPrayer?.name}</div>
        <div className="prayer-small-time">{nextPrayer ? formatTime(nextPrayer.time) : '--:--'}</div>
        <div className="prayer-small-countdown">{countdown}</div>
      </div>
    );
  }

  const now = Date.now();
  const nextIndex = prayers.findIndex(p => p.name === nextPrayer?.name);
  const prevIndex = nextIndex <= 0 ? prayers.length - 1 : nextIndex - 1;
  const prevTime = prayers[prevIndex].time.getTime();
  const nextTime = nextPrayer?.time.getTime() ?? now + 1;
  const progress = Math.max(0, Math.min(100, ((now - prevTime) / Math.max(nextTime - prevTime, 1)) * 100));

  return (
    <div className={`prayer-widget-full ${sizeTier}`}>
      <div className="prayer-header">
        <span className="prayer-header-title">Prayer Times</span>
        {sizeTier === 'large' && <span className="prayer-header-next">{nextPrayer?.name} in {countdown}</span>}
      </div>

      <div className="prayer-list">
        {prayers.map(p => (
          <div key={p.name} className={`prayer-row ${nextPrayer?.name === p.name ? 'active' : ''}`}>
            <span className="prayer-name">{p.name}</span>
            <span className="prayer-time">{formatTime(p.time)}</span>
          </div>
        ))}
      </div>

      {sizeTier === 'large' && (
        <div className="prayer-progress-section">
          <div className="prayer-progress-bar">
            <div className="prayer-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="prayer-progress-labels">
            <span>{prayers[prevIndex].name}</span>
            <span>{nextPrayer?.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};


export default PrayerTimesWidget;
