import React from 'react';
import { getDailyAyah } from '../../lib/quran';
import { toHijri } from '../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const DailyAyahWidget: React.FC<WidgetComponentProps> = ({ sizeTier }) => {
  const h = toHijri(new Date());
  const ayah = getDailyAyah(h.day);

  if (sizeTier === 'small') {
    return <div className="widget-body-empty">{ayah.surah}</div>;
  }

  return (
    <div className="widget-body-ayah">
      <div className="widget-body-ayah-text">{ayah.arabic}</div>
      <div className="widget-body-submetric">{ayah.surah} {ayah.ayahNumber}</div>
    </div>
  );
};

export default DailyAyahWidget;
