import React from 'react';
import { CalendarDays, CheckSquare, CloudRain, CloudSnow, CloudSun, Compass, FileText, Quote, StickyNote, Sun, Wind, Zap } from 'lucide-react';
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

export const WidgetMiniPreview: React.FC<{ widgetId: WidgetId }> = ({ widgetId }) => {
    switch (widgetId) {
        case 'prayer-times':
            return (
                <div className="widget-mini widget-mini-prayers">
                    <div className="widget-mini-line" />
                    <div className="widget-mini-line" />
                    <div className="widget-mini-line" />
                </div>
            );
        case 'next-prayer':
        case 'ramadan-countdown':
            return (
                <div className="widget-mini widget-mini-countdown">
                    <div className="widget-mini-seg" />
                    <div className="widget-mini-seg" />
                    <div className="widget-mini-seg" />
                </div>
            );
        case 'hijri-date':
            return (
                <div className="widget-mini widget-mini-date">
                    <div className="widget-mini-calendar-top" />
                    <div className="widget-mini-calendar-grid" />
                </div>
            );
        case 'clock':
            return (
                <div className="widget-mini widget-mini-clock">
                    <div className="widget-mini-clock-face">
                        <span className="widget-mini-hand short" />
                        <span className="widget-mini-hand long" />
                    </div>
                </div>
            );
        case 'daily-ayah':
            return (
                <div className="widget-mini widget-mini-quote">
                    <div className="widget-mini-ayah-head">
                        <Quote size={14} strokeWidth={2} />
                        <span className="widget-mini-ayah-word">Ayah</span>
                    </div>
                    <div className="widget-mini-quote-lines"><span /><span /><span /></div>
                </div>
            );
        case 'focus-task':
            return (
                <div className="widget-mini widget-mini-task">
                    <div className="widget-mini-task-row"><CheckSquare size={14} strokeWidth={2} /><span className="widget-mini-task-line" /></div>
                    <div className="widget-mini-task-row"><CheckSquare size={14} strokeWidth={2} /><span className="widget-mini-task-line" /></div>
                </div>
            );
        case 'dhikr-counter':
            return (
                <div className="widget-mini widget-mini-counter">
                    <div className="widget-mini-counter-ring">18</div>
                </div>
            );
        case 'prayer-streak':
            return (
                <div className="widget-mini widget-mini-streak">
                    <div className="widget-mini-streak-dots">
                        <span /><span /><span /><span /><span className="active" /><span className="active" /><span className="active" />
                    </div>
                </div>
            );
        case 'qibla-compass':
            return (
                <div className="widget-mini widget-mini-qibla">
                    <Compass size={16} strokeWidth={2} />
                </div>
            );
        case 'weather':
            return <WeatherMiniPreview />;
        case 'tasbeeh':
            return (
                <div className="widget-mini widget-mini-tasbeeh">
                    <div className="widget-mini-beads"><span /><span /><span /></div>
                </div>
            );
        case 'bookmarks':
            return <BookmarksMiniPreview />;
        case 'note':
            return (
                <div className="widget-mini widget-mini-note">
                    <StickyNote size={14} strokeWidth={2} />
                    <div className="widget-mini-note-paper" />
                </div>
            );
        default:
            return (
                <div className="widget-mini widget-mini-generic">
                    <CalendarDays size={15} strokeWidth={2} />
                    <FileText size={15} strokeWidth={2} />
                </div>
            );
    }
};
