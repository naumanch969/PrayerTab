import React from 'react';
import './qibla-compass/styles.css';
import { calculateQibla } from '../../lib/qibla';
import type { WidgetComponentProps } from '../types';

const QiblaCompassWidget: React.FC<WidgetComponentProps> = ({ settings }) => {
  if (!settings.location) return <div className="widget-body-empty">Set location</div>;

  const bearing = calculateQibla(settings.location.latitude, settings.location.longitude);
  const direction = (() => {
    const b = Math.round(bearing);
    if (b >= 337 || b < 23) return 'North';
    if (b < 68) return 'North-East';
    if (b < 113) return 'East';
    if (b < 158) return 'South-East';
    if (b < 203) return 'South';
    if (b < 248) return 'South-West';
    if (b < 293) return 'West';
    return 'North-West';
  })();

  return (
    <div className="sample-widget sample-qibla">
      <div className="sample-widget-label">Qibla</div>
      <div className="sample-qibla-row">
        <div className="sample-qibla-ring">
          <span>N</span>
          <i style={{ transform: `rotate(${bearing}deg)` }} />
        </div>
        <div>
          <div className="sample-widget-title">{Math.round(bearing)}°</div>
          <div className="sample-widget-sub">{direction}</div>
        </div>
      </div>
    </div>
  );
};

export default QiblaCompassWidget;
