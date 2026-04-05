import React from 'react';
import './prayer-times/styles.css';
import { Compass, Settings } from 'lucide-react';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import type { WidgetComponentProps } from '../types';

type PrayerTrack = {
  name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  short: string;
  time: Date;
  streakKey?: keyof Omit<NonNullable<WidgetComponentProps['runtime']['todayLog']>, 'date'>;
};

const PrayerTimesWidget: React.FC<WidgetComponentProps> = ({ isEditMode, settings, sizeTier, runtime }) => {
  const { times, nextPrayer, countdown, loading } = usePrayerTimes(settings.location, settings.calculationMethod);

  const openPrayerSettings = () => {
    if (isEditMode) return;
    if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  if (loading) {
    return <div className="widget-body-empty">Loading salah...</div>;
  }

  if (!times) {
    return (
      <div className="widget-body-empty">
        <div>Set location</div>
        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.6 }}>
          {settings.location ? `(${settings.location.latitude.toFixed(2)}°, ${settings.location.longitude.toFixed(2)}°)` : 'Detecting...'}
        </div>
      </div>
    );
  }

  const prayers: PrayerTrack[] = [
    { name: 'Fajr', short: 'Fajr', time: times.Fajr, streakKey: 'Fajr' },
    { name: 'Sunrise', short: 'Sun', time: times.Sunrise },
    { name: 'Dhuhr', short: 'Dhu', time: times.Dhuhr, streakKey: 'Dhuhr' },
    { name: 'Asr', short: 'Asr', time: times.Asr, streakKey: 'Asr' },
    { name: 'Maghrib', short: 'Mag', time: times.Maghrib, streakKey: 'Maghrib' },
    { name: 'Isha', short: 'Isha', time: times.Isha, streakKey: 'Isha' },
  ];

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.clockFormat === '12h',
  });

  const formatTimelineTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: settings.clockFormat === '12h',
  });

  const nextPrayerName = nextPrayer?.name ?? 'Prayer';
  const nextPrayerTime = nextPrayer ? formatTime(nextPrayer.time) : '--:--';
  const msRemaining = Math.max(0, (nextPrayer?.time.getTime() ?? Date.now()) - Date.now());
  const minsRemaining = Math.max(0, Math.ceil(msRemaining / 60000));
  const minsLabel = `${minsRemaining} MIN${minsRemaining === 1 ? '' : 'S'}`;
  const completedToday = runtime.todayLog
    ? prayers.filter((prayer) => prayer.streakKey && runtime.todayLog?.[prayer.streakKey] === 'completed').length
    : 0;

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
          {settings.location?.city && sizeTier === 'large' && (
            <p className="pt-city">{settings.location.city}</p>
          )}
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
            const status = p.streakKey ? (runtime.todayLog?.[p.streakKey] ?? 'pending') : 'pending';
            const isCompleted = status === 'completed';
            return (
              <div key={p.name} className={`pt-stop ${isActive ? 'active' : ''}`}>
                <div className="pt-stop-label">{p.short}</div>
                <div className="pt-stop-dot-wrap">
                  {p.streakKey ? (
                    <button
                      type="button"
                      className={`pt-stop-check ${isCompleted ? 'completed' : ''}`}
                      title={`${p.name}: ${status}`}
                      onClick={() => {
                        if (isEditMode) return;
                        void runtime.togglePrayer(p.streakKey!, status);
                      }}
                      disabled={isEditMode}
                      aria-label={`Mark ${p.name} as ${isCompleted ? 'pending' : 'completed'}`}
                    >
                      {isCompleted ? <span className="pt-stop-check-mark">✓</span> : null}
                    </button>
                  ) : (
                    <span className="pt-stop-dot sunrise" aria-hidden="true" />
                  )}
                </div>
                <div className="pt-stop-time">{formatTimelineTime(p.time)}</div>
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
        </div>
      )}

      <div className="pt-footer">
        <button
          type="button"
          className="pt-footer-action"
          disabled={isEditMode}
          onClick={() => {
            if (!isEditMode) {
              window.open('https://qiblafinder.withgoogle.com/', '_blank', 'noopener,noreferrer');
            }
          }}
          title="Open Qibla Finder"
        >
          <Compass size={15} strokeWidth={2} />
          <span>Qibla</span>
        </button>
        <div className="pt-footer-icons">
          <div className="pt-completed-chip" title="Completed today" aria-label="Completed today">
            {completedToday}/5
          </div>
          <button
            type="button"
            className="pt-settings-dot"
            disabled={isEditMode}
            onClick={openPrayerSettings}
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
