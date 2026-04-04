import React from 'react';
import './clock/styles.css';
import { useClock } from '../../../hooks/useClock';
import type { WidgetComponentProps } from '../types';

const ClockWidget: React.FC<WidgetComponentProps> = ({ settings, sizeTier }) => {
  const { now, timeString, greeting } = useClock(settings.clockFormat || '12h', settings.clockShowSeconds || false);
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: sizeTier === 'small' ? undefined : 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`clock-widget ${sizeTier}`}>
      {sizeTier !== 'small' && <div className="clock-greeting">{greeting}</div>}
      <div className="clock-time">{timeString}</div>
      <div className="clock-date">{dateStr}</div>
    </div>
  );
};


export default ClockWidget;
