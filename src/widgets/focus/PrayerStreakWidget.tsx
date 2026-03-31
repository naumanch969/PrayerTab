import React from 'react';
import type { WidgetComponentProps } from '../types';

const PrayerStreakWidget: React.FC<WidgetComponentProps> = () => {
  const streak = 5;

  return (
    <div className="widget-body-streak">
      <div className="widget-body-metric">{streak} days</div>
      <div className="widget-body-streak-dots">
        <span className="on" /><span className="on" /><span className="on" /><span className="on" /><span className="on" /><span /><span />
      </div>
    </div>
  );
};

export default PrayerStreakWidget;
