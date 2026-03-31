import React from 'react';
import './clock/styles.css';
import { useClock } from '../../hooks/useClock';
import type { WidgetComponentProps } from '../types';

const ClockWidget: React.FC<WidgetComponentProps> = () => {
  const { now, timeString } = useClock();
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="sample-widget sample-clock">
      <div className="sample-clock-time">{timeString}</div>
      <div className="sample-widget-sub">{date}</div>
    </div>
  );
};

export default ClockWidget;
