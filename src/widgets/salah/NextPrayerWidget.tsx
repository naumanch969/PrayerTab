import React from 'react';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const NextPrayerWidget: React.FC<WidgetComponentProps> = ({ settings }) => {
  const { nextPrayer, countdown, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

  if (loading) return <div className="widget-body-empty">Calculating...</div>;
  if (!nextPrayer) return <div className="widget-body-empty">No location</div>;

  return (
    <div className="widget-body-next-prayer">
      <div className="widget-body-kicker">Next</div>
      <div className="widget-body-metric">{nextPrayer.name}</div>
      <div className="widget-body-submetric">{countdown}</div>
    </div>
  );
};

export default NextPrayerWidget;
