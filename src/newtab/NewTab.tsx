import React, { useState, useMemo } from 'react';
import { useStorage } from '../hooks/useStorage';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useClock } from '../hooks/useClock';
import { toHijri, formatHijri, isRamadan } from '../lib/hijri';
import { getDailyAyah } from '../lib/quran';

import Onboarding from '../components/Onboarding';
import PrayerPanel from '../components/PrayerPanel';
import AyahCard from '../components/AyahCard';
import IntentionPanel from '../components/IntentionPanel';
import DhikrPanel from '../components/DhikrPanel';
import StreakPanel from '../components/StreakPanel';
import QiblaWidget from '../components/QiblaWidget';
import SettingsPanel from '../components/SettingsPanel';
import type { UserSettings } from '../types';

// Rotating mosque background images (Unsplash free-to-use)
const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1920&q=80', // Masjid al-Haram
  'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1920&q=80', // Sultan Ahmed Blue Mosque
  'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1920&q=80', // Hassan II
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1920&q=80', // Sheikh Zayed
  'https://images.unsplash.com/photo-1559329373-916f3239e5c8?w=1920&q=80', // Medina
];

function getDailyBackground(date: Date): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return BACKGROUNDS[dayOfYear % BACKGROUNDS.length];
}

const NewTab: React.FC = () => {
  const storage = useStorage();
  const { now, timeString, greeting } = useClock();
  const [showSettings, setShowSettings] = useState(false);

  const location = storage.settings?.location ?? null;
  const method   = storage.settings?.calculationMethod ?? 'MWL';

  const prayerState = usePrayerTimes(location, method);

  const hijri = useMemo(() => toHijri(now), [now.toDateString()]);
  const ayah  = useMemo(() => getDailyAyah(hijri.day), [hijri.day]);
  const bg    = useMemo(() => getDailyBackground(now), [now.toDateString()]);
  const ramadan = useMemo(() => isRamadan(now), [now.toDateString()]);

  // Show onboarding until setup is complete
  if (storage.loading) return null;
  if (!storage.settings?.onboardingComplete) {
    return (
      <Onboarding
        onComplete={(s: UserSettings) => storage.updateSettings(s)}
      />
    );
  }

  const { settings, todayLog, streak, dhikr, intention } = storage;

  return (
    <div className="nt-root">
      {/* Background */}
      <div
        className="nt-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="nt-overlay" />

      {/* Ramadan banner */}
      {ramadan && (
        <div className="ramadan-banner">
          🌙 Ramadan Mubarak — May your fasts be accepted
        </div>
      )}

      {/* Settings button */}
      <button className="nt-settings-btn" onClick={() => setShowSettings(true)} title="Settings">
        ⚙
      </button>

      {/* Three-column layout */}
      <div className="nt-layout">

        {/* ── LEFT PANEL ─────────────────────────────────── */}
        <aside className="nt-panel nt-panel-left">
          {/* Date block */}
          <div className="date-block">
            <div className="date-gregorian">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div className="date-hijri">{formatHijri(hijri)}</div>
          </div>

          <PrayerPanel
            times={prayerState.times}
            todayLog={todayLog}
            nextPrayerName={prayerState.nextPrayer?.name ?? null}
            countdown={prayerState.countdown}
            loading={prayerState.loading}
            onToggle={storage.togglePrayer}
          />

          {location && (
            <QiblaWidget latitude={location.latitude} longitude={location.longitude} />
          )}
        </aside>

        {/* ── CENTER ─────────────────────────────────────── */}
        <main className="nt-center">
          <div className="greeting">
            <span className="greeting-salaam">Assalamu Alaikum</span>
            {settings?.name && <span className="greeting-name">, {settings.name}</span>}
          </div>
          <div className="greeting-subtext">{greeting}</div>

          <div className="nt-clock">{timeString}</div>

          {prayerState.nextPrayer && (
            <div className="center-countdown">
              <span className="center-countdown-label">
                {ramadan ? 'Time until Iftar (Maghrib)' : `${prayerState.nextPrayer.name} in`}
              </span>
              <span className="center-countdown-timer">{prayerState.countdown}</span>
            </div>
          )}

          <AyahCard ayah={ayah} />

          <IntentionPanel
            intention={intention?.text ?? ''}
            onSave={storage.setIntention}
          />
        </main>

        {/* ── RIGHT PANEL ────────────────────────────────── */}
        <aside className="nt-panel nt-panel-right">
          <StreakPanel streak={streak} todayLog={todayLog} />
          <DhikrPanel dhikr={dhikr} onTap={storage.tapDhikr} />
        </aside>
      </div>

      {/* Settings overlay */}
      {showSettings && settings && (
        <SettingsPanel
          settings={settings}
          onSave={(updated: UserSettings) => storage.updateSettings(updated)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default NewTab;
