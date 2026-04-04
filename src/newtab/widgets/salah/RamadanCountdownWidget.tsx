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
      <div className="ramadan-widget small">
        <div className="ramadan-val">{inRamadan ? `Day ${h.day}` : `${daysUntilRamadan}d`}</div>
      </div>
    );
  }

  return (
    <div className={`ramadan-widget ${sizeTier}`}>
      <div className="ramadan-header">
        <span className="ramadan-label">{inRamadan ? 'Holy Ramadan' : 'Countdown'}</span>
        {inRamadan && <span className="ramadan-day-badge">Day {h.day}</span>}
      </div>

      <div className="ramadan-main">
        {inRamadan ? (
          <div className="ramadan-fasting-info">
            {times ? (
              <>
                <div className="fasting-row">
                  <span>Sehri Ends</span>
                  <span className="time">{formatTime(times.Fajr)}</span>
                </div>
                <div className="fasting-row">
                  <span>Iftar Starts</span>
                  <span className="time">{formatTime(times.Maghrib)}</span>
                </div>
              </>
            ) : (
              <div className="ramadan-msg">Fasting in progress</div>
            )}
          </div>
        ) : (
          <div className="ramadan-countdown-box">
             <div className="days-big">{daysUntilRamadan}</div>
             <div className="days-label">Days until Ramadan</div>
          </div>
        )}
      </div>

      {sizeTier === 'large' && !inRamadan && (
        <div className="ramadan-footer">
          <div className="ramadan-progress-bg">
            <div className="ramadan-progress-fill" style={{ width: `${Math.max(0, 100 - (daysUntilRamadan / 355 * 100))}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RamadanCountdownWidget;
