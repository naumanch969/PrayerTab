import React from 'react';
import './ramadan-countdown/styles.css';
import type { WidgetComponentProps } from '../types';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import { toHijri } from '../../../lib/hijri';

const RamadanCountdownWidget: React.FC<WidgetComponentProps> = ({ settings, sizeTier }) => {
  const h = toHijri(new Date());
  const inRamadan = h.month === 9;
  const daysUntilRamadan = inRamadan ? 0 : ((9 - h.month + 12) % 12) * 29 + (30 - h.day);

  // For Ramadan state
  const { times } = usePrayerTimes(settings.location, settings.calculationMethod);
  const now = new Date();
  
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: settings.clockFormat === '12h'
  });

  if (sizeTier === 'small') {
    return (
      <div className="salah-ramadan-widget small">
        <div className="salah-ramadan-val">{inRamadan ? `Day ${h.day}` : `${daysUntilRamadan}d`}</div>
      </div>
    );
  }

  return (
    <div className={`salah-ramadan-widget ${sizeTier}`}>
      <div className="salah-ramadan-header">
        <span className="salah-ramadan-label">{inRamadan ? 'Holy Ramadan' : 'Countdown'}</span>
        {inRamadan && <span className="salah-ramadan-day-badge">Day {h.day}</span>}
      </div>

      <div className="salah-ramadan-main">
        {inRamadan ? (
          <div className="salah-ramadan-fasting-info">
            {times ? (
              <>
                <div className="salah-fasting-row">
                  <span>Sehri Ends</span>
                  <span className="time">{formatTime(times.Fajr)}</span>
                </div>
                <div className="salah-fasting-row">
                  <span>Iftar Starts</span>
                  <span className="time">{formatTime(times.Maghrib)}</span>
                </div>
              </>
            ) : (
              <div className="salah-ramadan-msg">Fasting in progress</div>
            )}
          </div>
        ) : (
          <div className="salah-ramadan-countdown-box">
             <div className="salah-days-big">{daysUntilRamadan}</div>
             <div className="salah-days-label">Days until Ramadan</div>
          </div>
        )}
      </div>

      {sizeTier === 'large' && !inRamadan && (
        <div className="salah-ramadan-footer">
          <div className="salah-ramadan-progress-bg">
            <div className="salah-ramadan-progress-fill" style={{ width: `${Math.max(0, 100 - (daysUntilRamadan / 355 * 100))}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RamadanCountdownWidget;
