import React from 'react';
import { getDailyAyah } from '../../lib/quran';
import { toHijri } from '../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const DailyAyahWidget: React.FC<WidgetComponentProps> = ({ sizeTier }) => {
  const h = toHijri(new Date());
  const ayah = getDailyAyah(h.day);

  if (sizeTier === 'small') {
    return <div className="sample-widget sample-ayah"><div className="sample-widget-label">Daily Ayah</div><div className="sample-widget-sub">{ayah.surah} {ayah.ayahNumber}</div></div>;
  }

  return (
    <div className="sample-widget sample-ayah">
      <div className="sample-widget-label">Daily Ayah</div>
      <div className="sample-ayah-arabic">{ayah.arabic}</div>
      {sizeTier === 'large' && <div className="sample-ayah-translation">{ayah.translation}</div>}
      <div className="sample-widget-sub">{ayah.surah} · {ayah.ayahNumber}</div>
    </div>
  );
};

export default DailyAyahWidget;
