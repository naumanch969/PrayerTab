import React from 'react';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const PrayerTimesWidget: React.FC<WidgetComponentProps> = ({ settings }) => {
  const { times, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

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

  return (
    <div className="widget-body-prayer-times">
      {rows.map(([name, time]) => (
        <div key={name} className="widget-body-row">
          <span>{name}</span>
          <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      ))}
    </div>
  );
};

export default PrayerTimesWidget;
