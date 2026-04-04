import React from 'react';
import './next-prayer/styles.css';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const NextPrayerWidget: React.FC<WidgetComponentProps> = ({ settings, sizeTier }) => {
  const { nextPrayer, countdown, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

  if (loading) return <div className="widget-body-empty">Calculating...</div>;
  if (!nextPrayer) return <div className="widget-body-empty">Set location</div>;

  const parts = countdown.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  const progressPct = Math.min(((hours * 60 + minutes) / 360) * 100, 100);

  if (sizeTier === 'small') {
    return (
      <div className="np-widget small">
        <div className="np-name">{nextPrayer.name}</div>
        <div className="np-countdown">{countdown}</div>
      </div>
    );
  }

  return (
    <div className={`np-widget ${sizeTier}`}>
      <div className="np-label">Next Prayer</div>
      <div className="np-name">{nextPrayer.name}</div>
      <div className="np-countdown">{countdown}</div>

      {sizeTier === 'large' && (
        <div className="np-breakdown">
          <span>{hours}h {minutes}m away</span>
        </div>
      )}

      <div className="np-bar-bg">
        <div className="np-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
};

export default NextPrayerWidget;
