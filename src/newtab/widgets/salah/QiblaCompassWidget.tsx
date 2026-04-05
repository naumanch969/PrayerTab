import React from 'react';
import './qibla-compass/styles.css';
import { calculateQibla, calculateDistanceToKaaba } from '../../../lib/qibla';
import type { WidgetComponentProps } from '../types';

const QiblaCompassWidget: React.FC<WidgetComponentProps> = ({ settings, sizeTier }) => {
  if (!settings.location) return <div className="widget-body-empty">Set location</div>;

  const { latitude, longitude } = settings.location;
  const bearing = calculateQibla(latitude, longitude);
  const distance = calculateDistanceToKaaba(latitude, longitude);

  const cardinal = (() => {
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

  if (sizeTier === 'small') {
    return (
      <div className="salah-qibla-widget small">
        <div className="salah-qibla-needle-wrap">
          <div className="salah-qibla-needle" style={{ transform: `rotate(${bearing}deg)` }} />
        </div>
        <div className="salah-qibla-value">{Math.round(bearing)}°</div>
      </div>
    );
  }

  return (
    <div className={`salah-qibla-widget ${sizeTier}`}>
      <div className="salah-qibla-head">
        <span className="salah-qibla-kicker">Qibla Direction</span>
        <span className="salah-qibla-pill">{Math.round(bearing)}°</span>
      </div>

      <div className="salah-qibla-compass-box">
        <div className="salah-qibla-ring">
          <span className="n">N</span>
          <span className="e">E</span>
          <span className="s">S</span>
          <span className="w">W</span>
          <div className="salah-qibla-bearing-line" style={{ transform: `rotate(${bearing}deg)` }}>
             <div className="salah-qibla-pointer" />
          </div>
        </div>
        
        <div className="salah-qibla-info">
          <div className="salah-qibla-bearing-big">{cardinal}</div>
          <div className="salah-qibla-cardinal">Facing Makkah</div>
          {sizeTier === 'large' && (
            <div className="salah-qibla-distance">{distance.toLocaleString()} km to Kaaba</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QiblaCompassWidget;
