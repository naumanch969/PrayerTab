import React from 'react';
import './next-prayer/styles.css';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const NextPrayerWidget: React.FC<WidgetComponentProps> = ({ settings }) => {
  const { nextPrayer, countdown, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

  if (loading) return <div className="widget-body-empty">Calculating...</div>;
  if (!nextPrayer) return <div className="widget-body-empty">No location</div>;

  const pieces = countdown.split(':').map((part) => Number(part));
  const hours = pieces[0] ?? 0;
  const minutes = pieces[1] ?? 0;

  return (
    <div className="sample-widget sample-next-prayer">
      <div className="sample-widget-label">Next Prayer</div>
      <div className="sample-next-name">{nextPrayer.name} in</div>
      <div className="sample-next-time">{countdown}</div>
      <div className="sample-widget-sub">{hours} hrs {minutes} min</div>
      <div className="sample-progress-bar compact"><span style={{ width: `${Math.min((hours * 60 + minutes) / 360 * 100, 100)}%` }} /></div>
    </div>
  );
};

export default NextPrayerWidget;
