import React from 'react';
import type { WidgetComponentProps } from '../types';

const WeatherWidget: React.FC<WidgetComponentProps> = () => {
  return (
    <div className="widget-body-next-prayer">
      <div className="widget-body-metric">23 C</div>
      <div className="widget-body-submetric">Clear sky</div>
    </div>
  );
};

export default WeatherWidget;
