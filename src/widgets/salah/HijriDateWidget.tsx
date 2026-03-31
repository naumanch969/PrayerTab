import React from 'react';
import { toHijri } from '../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const HijriDateWidget: React.FC<WidgetComponentProps> = () => {
  const h = toHijri(new Date());
  const g = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="sample-widget sample-hijri-date">
      <div className="sample-widget-label">Hijri Date</div>
      <div className="sample-widget-title">{h.day} {h.monthName}</div>
      <div className="sample-widget-sub">{h.year} AH · {g}</div>
    </div>
  );
};

export default HijriDateWidget;
