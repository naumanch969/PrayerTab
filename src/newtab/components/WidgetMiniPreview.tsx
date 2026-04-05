import React from 'react';
import { CalendarDays, CheckSquare, CloudRain, CloudSnow, CloudSun, Compass, FileText, Quote, Sun, Wind, Zap } from 'lucide-react';
import type { WidgetId } from '../../types';

type MiniWeatherTone = 'sunny' | 'cloudy' | 'rain' | 'snow' | 'windy' | 'storm';

interface MiniWeatherState {
    tone: MiniWeatherTone;
    temp: number;
    high: number;
    low: number;
    wind: number;
    label: string;
}

const MINI_WEATHER_STATES: MiniWeatherState[] = [
    { tone: 'sunny', temp: 29, high: 32, low: 24, wind: 8, label: 'Clear sky' },
    { tone: 'cloudy', temp: 26, high: 29, low: 22, wind: 10, label: 'Cloud cover' },
    { tone: 'rain', temp: 27, high: 30, low: 22, wind: 12, label: 'Rainy' },
    { tone: 'windy', temp: 25, high: 28, low: 21, wind: 24, label: 'Windy' },
    { tone: 'snow', temp: 2, high: 4, low: -1, wind: 14, label: 'Snow' },
    { tone: 'storm', temp: 23, high: 26, low: 20, wind: 30, label: 'Thunder' },
];

const getMiniWeatherIcon = (tone: MiniWeatherTone) => {
    switch (tone) {
        case 'sunny':
            return Sun;
        case 'cloudy':
            return CloudSun;
        case 'rain':
            return CloudRain;
        case 'snow':
            return CloudSnow;
        case 'windy':
            return Wind;
        case 'storm':
            return Zap;
        default:
            return CloudSun;
    }
};

const WeatherMiniPreview: React.FC = () => {
    const [activeIndex, setActiveIndex] = React.useState(() => {
        const hour = new Date().getHours();
        return hour % MINI_WEATHER_STATES.length;
    });

    React.useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % MINI_WEATHER_STATES.length);
        }, 4000);

        return () => window.clearInterval(intervalId);
    }, []);

    const state = MINI_WEATHER_STATES[activeIndex];
    const Icon = getMiniWeatherIcon(state.tone);

    return (
        <div className={`widget-mini widget-mini-weather tone-${state.tone}`}>
            <div className="widget-mini-weather-scene" aria-hidden="true">
                <span className="widget-mini-weather-glow" />
                {(state.tone === 'sunny' || state.tone === 'cloudy' || state.tone === 'rain' || state.tone === 'windy' || state.tone === 'storm' || state.tone === 'snow') && (
                    <span className="widget-mini-weather-cloud" />
                )}

                {(state.tone === 'rain' || state.tone === 'storm') && (
                    <>
                        <span className="widget-mini-weather-rain rain-a" />
                        <span className="widget-mini-weather-rain rain-b" />
                        <span className="widget-mini-weather-rain rain-c" />
                        <span className="widget-mini-weather-rain rain-d" />
                    </>
                )}

                {state.tone === 'snow' && (
                    <>
                        <span className="widget-mini-weather-snow snow-a" />
                        <span className="widget-mini-weather-snow snow-b" />
                        <span className="widget-mini-weather-snow snow-c" />
                        <span className="widget-mini-weather-snow snow-d" />
                    </>
                )}

                {state.tone === 'windy' && (
                    <>
                        <span className="widget-mini-weather-wind wind-a" />
                        <span className="widget-mini-weather-wind wind-b" />
                    </>
                )}

                {state.tone === 'storm' && <span className="widget-mini-weather-lightning" />}
            </div>

            <div className="widget-mini-weather-head">
                <div className="widget-mini-weather-head-left">
                    <span className="widget-mini-weather-kicker">Weather</span>
                    <span className="widget-mini-weather-updated">Auto</span>
                </div>
            </div>

            <div className="widget-mini-weather-main">
                <div className="widget-mini-weather-hero">
                    <span className="widget-mini-weather-icon"><Icon size={13} strokeWidth={2.1} /></span>
                    <span className="widget-mini-weather-temp">{state.temp}°</span>
                </div>
                <span className="widget-mini-weather-condition">{state.label}</span>
            </div>

            <div className="widget-mini-weather-footer">
                <span className="widget-mini-weather-chip">H {state.high}° · L {state.low}°</span>
                <span className="widget-mini-weather-chip">{state.wind} km/h</span>
            </div>
        </div>
    );
};

const BOOKMARK_PREVIEW_ITEMS = ['Quran', 'Prayer API', 'Studio', 'Web Store', 'Figma', 'Meteo'];

const BookmarksMiniPreview: React.FC = () => {
    return (
        <div className="widget-mini widget-mini-bookmarks">
            <div className="widget-mini-bookmarks-strip" aria-hidden="true">
                {BOOKMARK_PREVIEW_ITEMS.map((item) => (
                    <span key={item} className="widget-mini-bookmark-pill">
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

const NoteMiniPreview: React.FC = () => {
    return (
        <div className="widget-mini widget-mini-note">
            <div className="widget-mini-note-head">
                <span className="widget-mini-note-label">Note</span>
                <span className="widget-mini-note-pill">Saved locally</span>
            </div>

            <div className="widget-mini-note-paper" aria-hidden="true" />
        </div>
    );
};

export const WidgetMiniPreview: React.FC<{ widgetId: WidgetId }> = ({ widgetId }) => {
    switch (widgetId) {
        case 'prayer-times':
            return (
                <div className="widget-mini widget-mini-salah-prayers">
                    <div className="widget-mini-salah-prayers-head">
                        <span>Dhuhr</span>
                        <span>1:18 PM</span>
                    </div>
                    <div className="widget-mini-salah-prayers-track"><span /></div>
                    <div className="widget-mini-salah-prayers-grid">
                        <span>Fajr</span>
                        <span className="active">Dhuhr</span>
                        <span>Asr</span>
                    </div>
                </div>
            );
        case 'next-prayer':
            return (
                <div className="widget-mini widget-mini-salah-next">
                    <div className="widget-mini-salah-next-head">
                        <span>Next Prayer</span>
                        <span>1:18 PM</span>
                    </div>
                    <div className="widget-mini-salah-next-name">Dhuhr</div>
                    <div className="widget-mini-salah-next-countdown">01:42:15</div>
                    <div className="widget-mini-salah-next-track"><span /></div>
                </div>
            );
        case 'ramadan-countdown':
            return (
                <div className="widget-mini widget-mini-salah-ramadan">
                    <div className="widget-mini-salah-ramadan-head">
                        <span>Countdown</span>
                        <span>Ramadan</span>
                    </div>
                    <div className="widget-mini-salah-ramadan-days">134</div>
                    <div className="widget-mini-salah-ramadan-label">Days to go</div>
                    <div className="widget-mini-salah-ramadan-track"><span /></div>
                </div>
            );
        case 'hijri-date':
            return (
                <div className="widget-mini widget-mini-salah-hijri">
                    <div className="widget-mini-salah-hijri-head">
                        <span>Hijri</span>
                        <span>1447 AH</span>
                    </div>
                    <div className="widget-mini-salah-hijri-main">
                        <div className="widget-mini-salah-hijri-day">21</div>
                        <div className="widget-mini-salah-hijri-copy">
                            <span>Sha'ban</span>
                            <span>Thu, Mar 5</span>
                        </div>
                    </div>
                </div>
            );
        case 'clock':
            return (
                <div className="widget-mini widget-mini-clock">
                    <div className="widget-mini-clock-head">
                        <span className="widget-mini-clock-kicker">Now</span>
                        <span className="widget-mini-clock-pill">24h</span>
                    </div>

                    <div className="widget-mini-clock-main">
                        <span className="widget-mini-clock-time">08:45</span>
                        <span className="widget-mini-clock-date">Thu · 21 Sha</span>
                    </div>

                    <span className="widget-mini-clock-meta">Local time</span>
                </div>
            );
        case 'daily-ayah':
            return (
                <div className="widget-mini widget-mini-quote">
                    <div className="widget-mini-ayah-head">
                        <Quote size={14} strokeWidth={2} />
                        <span className="widget-mini-ayah-word">Daily Ayah</span>
                    </div>
                    <div className="widget-mini-ayah-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                    <div className="widget-mini-ayah-translation">In the name of Allah, the Most Gracious, the Most Merciful.</div>
                    <div className="widget-mini-ayah-foot">
                        <span>Al-Fatihah</span>
                        <span>1:1</span>
                    </div>
                </div>
            );
        case 'focus-task':
            return (
                <div className="widget-mini widget-mini-task">
                    <div className="widget-mini-task-head">
                        <span className="widget-mini-task-kicker">Focus</span>
                        <span className="widget-mini-task-state">Running</span>
                    </div>

                    <div className="widget-mini-task-input-row">
                        <CheckSquare size={12} strokeWidth={2.1} />
                        <span className="widget-mini-task-line" />
                    </div>

                    <div className="widget-mini-task-progress"><span /></div>

                    <div className="widget-mini-task-timer-row">
                        <span className="widget-mini-task-timer">21:08</span>
                        <div className="widget-mini-task-controls">
                            <span />
                            <span />
                        </div>
                    </div>
                </div>
            );
        case 'dhikr-counter':
            return (
                <div className="widget-mini widget-mini-counter">
                    <span className="widget-mini-counter-label">Subhanallah</span>
                    <div className="widget-mini-counter-ring">18</div>
                    <div className="widget-mini-counter-track"><span /></div>
                </div>
            );
        case 'prayer-streak':
            return (
                <div className="widget-mini widget-mini-streak">
                    <div className="widget-mini-streak-head">
                        <div className="widget-mini-streak-value-wrap">
                            <span className="widget-mini-streak-number">5</span>
                            <span className="widget-mini-streak-label">days</span>
                        </div>
                        <span className="widget-mini-streak-pill">3/5 done</span>
                    </div>

                    <div className="widget-mini-streak-dots">
                        <span className="active">F</span>
                        <span className="active">D</span>
                        <span className="active">A</span>
                        <span>M</span>
                        <span>I</span>
                    </div>
                </div>
            );
        case 'qibla-compass':
            return (
                <div className="widget-mini widget-mini-salah-qibla">
                    <div className="widget-mini-salah-qibla-head">
                        <span>Qibla</span>
                        <span>292°</span>
                    </div>
                    <div className="widget-mini-salah-qibla-compass">
                        <Compass size={13} strokeWidth={2} />
                    </div>
                    <div className="widget-mini-salah-qibla-label">North-West</div>
                </div>
            );
        case 'weather':
            return <WeatherMiniPreview />;
        case 'tasbeeh':
            return (
                <div className="widget-mini widget-mini-tasbeeh">
                    <div className="widget-mini-tasbeeh-row active">
                        <span>Subhanallah</span>
                        <span>11</span>
                        <i />
                    </div>
                    <div className="widget-mini-tasbeeh-row">
                        <span>Alhamdulillah</span>
                        <span>7</span>
                        <i />
                    </div>
                    <div className="widget-mini-tasbeeh-row">
                        <span>Allahu Akbar</span>
                        <span>2</span>
                        <i />
                    </div>
                </div>
            );
        case 'bookmarks':
            return <BookmarksMiniPreview />;
        case 'note':
            return <NoteMiniPreview />;
        default:
            return (
                <div className="widget-mini widget-mini-generic">
                    <CalendarDays size={15} strokeWidth={2} />
                    <FileText size={15} strokeWidth={2} />
                </div>
            );
    }
};
