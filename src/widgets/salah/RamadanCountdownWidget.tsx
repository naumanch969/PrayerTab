import React from 'react';
import { toHijri } from '../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const RamadanCountdownWidget: React.FC<WidgetComponentProps> = () => {
  const h = toHijri(new Date());
  const inRamadan = h.month === 9;
  const daysUntilRamadan = inRamadan ? 0 : ((9 - h.month + 12) % 12) * 29 + (30 - h.day);

  return (
    <div className="widget-body-next-prayer">
      <div className="widget-body-kicker">Ramadan</div>
      <div className="widget-body-metric">{inRamadan ? 'Active' : `${daysUntilRamadan} days`}</div>
      <div className="widget-body-submetric">{inRamadan ? `Day ${h.day}` : 'until start'}</div>
    </div>
  );
};

export default RamadanCountdownWidget;
