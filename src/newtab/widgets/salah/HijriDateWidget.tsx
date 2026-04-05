import React from 'react';
import './hijri-date/styles.css';
import { toHijri } from '../../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const HijriDateWidget: React.FC<WidgetComponentProps> = () => {
  const h = toHijri(new Date());
  const g = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="salah-hijri-widget">
      <div className="salah-hijri-head">
        <span className="salah-hijri-kicker">Hijri Date</span>
        <span className="salah-hijri-pill">{h.year} AH</span>
      </div>

      <div className="salah-hijri-main">
        <div className="salah-hijri-day">{h.day}</div>
        <div className="salah-hijri-copy">
          <div className="salah-hijri-month">{h.monthName}</div>
          <div className="salah-hijri-gregorian">{g}</div>
        </div>
      </div>
    </div>
  );
};

export default HijriDateWidget;
