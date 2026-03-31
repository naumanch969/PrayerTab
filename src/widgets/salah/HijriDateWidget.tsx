import React from 'react';
import { toHijri } from '../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const HijriDateWidget: React.FC<WidgetComponentProps> = () => {
  const h = toHijri(new Date());

  return (
    <div className="widget-body-hijri">
      <div className="widget-body-metric">{h.day}</div>
      <div className="widget-body-submetric">{h.monthName} {h.year}</div>
    </div>
  );
};

export default HijriDateWidget;
