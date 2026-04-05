import React, { useState } from 'react';
import './prayer-times/styles.css';
import { Compass, Settings, Volume2 } from 'lucide-react';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

const PrayerTimesWidget: React.FC<WidgetComponentProps> = ({ isEditMode, settings, sizeTier }) => {
  const [showQiblaPreview, setShowQiblaPreview] = useState(false);
  const { times, nextPrayer, countdown, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

  if (loading) {
    return <div className="widget-body-empty">Loading salah...</div>;
  }

  if (!times) {
    return <div className="widget-body-empty">Set location</div>;
  }

  const prayers = [
    { name: 'Fajr', time: times.Fajr },
    { name: 'Sunrise', time: times.Sunrise },
    { name: 'Dhuhr', time: times.Dhuhr },
    { name: 'Asr', time: times.Asr },
    { name: 'Maghrib', time: times.Maghrib },
    { name: 'Isha', time: times.Isha },
  ];

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.clockFormat === '12h',
  });

  const nextPrayerName = nextPrayer?.name ?? 'Prayer';
  const nextPrayerTime = nextPrayer ? formatTime(nextPrayer.time) : '--:--';
  const msRemaining = Math.max(0, (nextPrayer?.time.getTime() ?? Date.now()) - Date.now());
  const minsRemaining = Math.max(0, Math.ceil(msRemaining / 60000));
  const minsLabel = `${minsRemaining} MIN${minsRemaining === 1 ? '' : 'S'}`;

  if (sizeTier === 'small') {
    return (
      <div className="pt-card pt-card-small">
        <div className="pt-small-name">{nextPrayerName}</div>
        <div className="pt-small-time">{nextPrayerTime}</div>
        <div className="pt-small-pill">IN {minsLabel}</div>
      </div>
    );
  }

  const now = Date.now();
  const nextIndex = prayers.findIndex(p => p.name === nextPrayer?.name);
  const prevIndex = nextIndex <= 0 ? prayers.length - 1 : nextIndex - 1;
  const prevTime = prayers[prevIndex].time.getTime();
  const nextTime = nextPrayer?.time.getTime() ?? now + 1;
  const progress = Math.max(0, Math.min(100, ((now - prevTime) / Math.max(nextTime - prevTime, 1)) * 100));

  return (
    <div className={`pt-card pt-card-full ${sizeTier}`}>
      <div className="pt-hero">
        <div className="pt-hero-left">
          <h3 className="pt-title">{nextPrayerName}</h3>
          <p className="pt-subtitle">Upcoming Prayer</p>
        </div>
        <div className="pt-hero-right">
          <div className="pt-main-time">{nextPrayerTime}</div>
          <div className="pt-badge">IN {minsLabel}</div>
        </div>
      </div>

      <div className="pt-timeline-wrap">
        <div className="pt-track-line" />
        <div className="pt-timeline-grid">
          {prayers.map((p) => {
            const isActive = p.name === nextPrayerName;
            return (
              <div key={p.name} className={`pt-stop ${isActive ? 'active' : ''}`}>
                <div className="pt-stop-label">{p.name}</div>
                <div className="pt-stop-dot-wrap">
                  <div className="pt-stop-dot" />
                </div>
                <div className="pt-stop-time">{formatTime(p.time)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {sizeTier === 'large' && (
        <div className="pt-progress-wrap">
          <div className="pt-progress-bar">
            <div className="pt-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="pt-progress-labels">
            <span>{prayers[prevIndex].name}</span>
            <span>{nextPrayerName}</span>
          </div>
        </div>
      )}

      <div className="pt-footer">
        <button
          type="button"
          className="pt-footer-action"
          disabled={isEditMode}
          onClick={() => {
            if (!isEditMode) {
              chrome.runtime.openOptionsPage?.();
            }
          }}
          title="Configure prayer notifications"
        >
          <Volume2 size={15} strokeWidth={2} />
          <span>Athan On</span>
        </button>
        <button
          type="button"
          className="pt-footer-action"
          disabled={isEditMode}
          onClick={() => {
            if (!isEditMode) {
              setShowQiblaPreview(!showQiblaPreview);
            }
          }}
          title="Show Qibla direction"
        >
          <Compass size={15} strokeWidth={2} />
          <span>Qibla</span>
        </button>
        <div className="pt-footer-icons">
          <div className="pt-avatar-dot" aria-hidden="true" />
          <button
            type="button"
            className="pt-settings-dot"
            disabled={isEditMode}
            onClick={() => {
              if (!isEditMode) {
                chrome.runtime.openOptionsPage?.();
              }
            }}
            aria-label="Prayer widget settings"
            title="Prayer settings"
          >
            <Settings size={14} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default PrayerTimesWidget;
