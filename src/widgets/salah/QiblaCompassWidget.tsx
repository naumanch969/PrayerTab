import React from 'react';
import { calculateQibla } from '../../lib/qibla';
import type { WidgetComponentProps } from '../types';

const QiblaCompassWidget: React.FC<WidgetComponentProps> = ({ settings }) => {
  if (!settings.location) return <div className="widget-body-empty">Set location</div>;

  const bearing = calculateQibla(settings.location.latitude, settings.location.longitude);

  return (
    <div className="widget-body-qibla">
      <div className="widget-body-compass-dot" style={{ transform: `rotate(${bearing}deg)` }} />
      <div className="widget-body-submetric">{Math.round(bearing)} deg</div>
    </div>
  );
};

export default QiblaCompassWidget;
