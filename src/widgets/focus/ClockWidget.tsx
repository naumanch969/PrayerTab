import React from 'react';
import { useClock } from '../../hooks/useClock';
import type { WidgetComponentProps } from '../types';

const ClockWidget: React.FC<WidgetComponentProps> = () => {
  const { timeString } = useClock();

  return (
    <div className="widget-body-next-prayer">
      <div className="widget-body-metric">{timeString}</div>
      <div className="widget-body-submetric">Local time</div>
    </div>
  );
};

export default ClockWidget;
