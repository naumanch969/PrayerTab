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
  const formatLabel = (settings.clockFormat || '12h') === '24h' ? '24H' : '12H';

  return (
    <div className={`clock-widget ${sizeTier}`}>
      <div className="clock-head">
        {sizeTier !== 'small' ? <div className="clock-greeting">{greeting}</div> : <div className="clock-greeting">Clock</div>}
        <span className="clock-format-pill">{formatLabel}</span>
      </div>

      <div className="clock-main">
        <div className="clock-time">{timeString}</div>
        <div className="clock-date">{dateStr}</div>
      </div>

      {sizeTier !== 'small' && <div className="clock-meta">Local time</div>}
    </div>
  );
};


export default ClockWidget;
