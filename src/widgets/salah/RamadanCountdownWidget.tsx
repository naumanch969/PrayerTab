import React from 'react';
import './ramadan-countdown/styles.css';
import { toHijri } from '../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const RamadanCountdownWidget: React.FC<WidgetComponentProps> = () => {
  const h = toHijri(new Date());
  const inRamadan = h.month === 9;
  const daysUntilRamadan = inRamadan ? 0 : ((9 - h.month + 12) % 12) * 29 + (30 - h.day);
  const progressDots = 8;
  const activeDots = inRamadan ? Math.max(1, Math.ceil((h.day / 30) * progressDots)) : Math.min(7, Math.ceil((progressDots - (daysUntilRamadan % progressDots))));

  return (
    <div className="sample-widget sample-ramadan">
      <div className="sample-widget-label">Ramadan</div>
      <div className="sample-widget-title">{inRamadan ? `Day ${h.day}` : `${daysUntilRamadan} days`}</div>
      <div className="sample-widget-sub">{inRamadan ? 'in progress' : 'until Ramadan begins'}</div>
      <div className="sample-dot-progress">
        {Array.from({ length: progressDots }).map((_, i) => (
          <span key={i} className={i < activeDots ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
};

export default RamadanCountdownWidget;
