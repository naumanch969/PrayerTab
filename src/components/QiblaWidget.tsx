import React from 'react';
import { calculateQibla } from '../lib/qibla';

interface QiblaWidgetProps {
  latitude: number;
  longitude: number;
}

const QiblaWidget: React.FC<QiblaWidgetProps> = ({ latitude, longitude }) => {
  const bearing = calculateQibla(latitude, longitude);

  return (
    <div className="qibla-widget">
      <div className="qibla-label">Qibla</div>
      <div className="qibla-compass" aria-label={`Qibla direction: ${Math.round(bearing)}°`}>
        {/* Compass ring */}
        <svg className="qibla-svg" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" className="qibla-ring" />
          {/* Cardinal points */}
          <text x="32" y="9" className="qibla-cardinal">N</text>
          <text x="32" y="60" className="qibla-cardinal">S</text>
          <text x="6" y="35" className="qibla-cardinal">W</text>
          <text x="56" y="35" className="qibla-cardinal">E</text>
          {/* Qibla needle */}
          <line
            x1="32" y1="32"
            x2={32 + 22 * Math.sin((bearing * Math.PI) / 180)}
            y2={32 - 22 * Math.cos((bearing * Math.PI) / 180)}
            className="qibla-needle"
          />
          {/* Kaaba icon at tip */}
          <circle
            cx={32 + 22 * Math.sin((bearing * Math.PI) / 180)}
            cy={32 - 22 * Math.cos((bearing * Math.PI) / 180)}
            r="3"
            className="qibla-needle-tip"
          />
          {/* Center dot */}
          <circle cx="32" cy="32" r="3" className="qibla-center-dot" />
        </svg>
      </div>
      <div className="qibla-bearing">{Math.round(bearing)}°</div>
    </div>
  );
};

export default QiblaWidget;
