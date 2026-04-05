import React, { useEffect, useMemo, useState } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudRain, CloudSnow, CloudSun, Sun, Wind, Zap } from 'lucide-react';
import './weather/styles.css';
import type { WidgetComponentProps } from '../types';

interface WeatherSnapshot {
  temp: number;
  max: number;
  min: number;
  weatherCode: number;
  windSpeed: number;
}

const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
};

type WeatherTone = 'sunny' | 'cloudy' | 'mist' | 'rain' | 'snow' | 'storm';
type WeatherToneKey = WeatherTone | 'windy';

const WEATHER_PREVIEW_TABS: Array<{ id: 'auto' | WeatherToneKey; label: string }> = [
  { id: 'auto', label: 'Auto' },
  { id: 'sunny', label: 'Sunny' },
  { id: 'cloudy', label: 'Cloudy' },
  { id: 'mist', label: 'Mist' },
  { id: 'rain', label: 'Rain' },
  { id: 'snow', label: 'Snow' },
  { id: 'windy', label: 'Wind' },
  { id: 'storm', label: 'Storm' },
];

const WEATHER_TONES: Array<{ code: number[]; tone: WeatherToneKey; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = [
  { code: [0, 1], tone: 'sunny', icon: Sun },
  { code: [2, 3], tone: 'cloudy', icon: CloudSun },
  { code: [45, 48], tone: 'mist', icon: CloudFog },
  { code: [51, 53, 55], tone: 'rain', icon: CloudDrizzle },
  { code: [61, 63, 65, 80, 81, 82], tone: 'rain', icon: CloudRain },
  { code: [71, 73, 75], tone: 'snow', icon: CloudSnow },
  { code: [95], tone: 'storm', icon: Zap },
];

const getWeatherVisual = (weatherCode?: number, windSpeed?: number) => {
  if (typeof windSpeed === 'number' && windSpeed >= 22 && typeof weatherCode === 'number' && weatherCode <= 3) {
    return { tone: 'windy' as WeatherToneKey, icon: Wind };
  }

  if (typeof weatherCode !== 'number') {
    return { tone: 'cloudy' as WeatherTone, icon: Cloud };
  }

  const matched = WEATHER_TONES.find((entry) => entry.code.includes(weatherCode));
  if (!matched) {
    return { tone: 'cloudy' as WeatherTone, icon: Cloud };
  }

  return { tone: matched.tone, icon: matched.icon };
};

const getToneIcon = (tone: WeatherToneKey) => {
  switch (tone) {
    case 'sunny':
      return Sun;
    case 'cloudy':
      return CloudSun;
    case 'mist':
      return CloudFog;
    case 'rain':
      return CloudRain;
    case 'snow':
      return CloudSnow;
    case 'windy':
      return Wind;
    case 'storm':
      return Zap;
    default:
      return Cloud;
  }
};

const getWeatherLabelFromTone = (tone: WeatherToneKey) => {
  switch (tone) {
    case 'sunny': return 'Clear sky';
    case 'cloudy': return 'Cloud cover';
    case 'mist': return 'Low visibility';
    case 'rain': return 'Rainy';
    case 'snow': return 'Snowy';
    case 'windy': return 'Windy';
    case 'storm': return 'Thunderstorm';
    default: return 'Local forecast';
  }
};

const WeatherWidget: React.FC<WidgetComponentProps> = ({ settings, isEditMode }) => {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [previewTone, setPreviewTone] = useState<'auto' | WeatherToneKey>('auto');

  useEffect(() => {
    const location = settings.location;
    if (!location) {
      setSnapshot(null);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    const fetchWeather = async () => {
      setStatus('loading');
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          setSnapshot(null);
          setStatus('error');
          return;
        }
        const data = await res.json();

        const temp = Number(data?.current?.temperature_2m);
        const weatherCode = Number(data?.current?.weather_code);
        const windSpeed = Number(data?.current?.wind_speed_10m ?? 0);
        const max = Number(data?.daily?.temperature_2m_max?.[0]);
        const min = Number(data?.daily?.temperature_2m_min?.[0]);
        if ([temp, weatherCode, windSpeed, max, min].some((n) => Number.isNaN(n))) {
          setSnapshot(null);
          setStatus('error');
          return;
        }

        setSnapshot({ temp, weatherCode, windSpeed, max, min });
        setStatus('ready');
      } catch {
        // Keep state explicit to avoid showing fake weather values.
        setSnapshot(null);
        setStatus('error');
      }
    };

    void fetchWeather();
    return () => controller.abort();
  }, [settings.location]);

  const weatherLabel = useMemo(() => {
    if (!settings.location) return 'Set location in Settings';
    if (status === 'loading') return 'Fetching weather…';
    if (status === 'error') return 'Weather unavailable';
    if (!snapshot) return 'Weather unavailable';
    return WEATHER_LABELS[snapshot.weatherCode] ?? 'Local forecast';
  }, [settings.location, snapshot, status]);

  const visual = useMemo(() => getWeatherVisual(snapshot?.weatherCode, snapshot?.windSpeed), [snapshot?.weatherCode, snapshot?.windSpeed]);
  const activeTone = previewTone === 'auto' ? visual.tone : previewTone;
  const Icon = previewTone === 'auto' ? visual.icon : getToneIcon(activeTone);

  const updatedAt = useMemo(
    () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    [snapshot?.weatherCode, snapshot?.temp, status]
  );

  const locationText = settings.location
    ? `${settings.location.latitude.toFixed(2)}°, ${settings.location.longitude.toFixed(2)}°`
    : 'Location required';

  useEffect(() => {
    if (!settings) return;
    if (previewTone !== 'auto' && !settings.location) {
      setPreviewTone('auto');
    }
  }, [settings, previewTone]);

  useEffect(() => {
    if (!settings) return;
    if (!settings.location) {
      setPreviewTone('auto');
    }
  }, [settings.location]);

  const sceneLabel = previewTone === 'auto'
    ? weatherLabel
    : getWeatherLabelFromTone(activeTone);

  return (
    <div className={`sample-widget sample-weather tone-${activeTone} status-${status}`} data-tone={activeTone} data-status={status}>
      {isEditMode && (
        <div className="sample-weather-tabs" role="tablist" aria-label="Weather preview modes">
          {WEATHER_PREVIEW_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`sample-weather-tab ${previewTone === tab.id ? 'active' : ''}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setPreviewTone(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className={`sample-weather-scene tone-${activeTone}`} aria-hidden="true">
        {activeTone === 'sunny' && (
          <>
            <span className="sample-weather-sun" />
            <span className="sample-weather-sun-rays" />
            <span className="sample-weather-haze" />
          </>
        )}
        {activeTone === 'cloudy' && (
          <>
            <span className="sample-weather-cloud cloud-a" />
            <span className="sample-weather-cloud cloud-b" />
          </>
        )}
        {activeTone === 'mist' && (
          <>
            <span className="sample-weather-mist" />
            <span className="sample-weather-cloud cloud-a" />
          </>
        )}
        {activeTone === 'rain' && (
          <>
            <span className="sample-weather-cloud cloud-a" />
            <span className="sample-weather-rain rain-a" />
            <span className="sample-weather-rain rain-b" />
            <span className="sample-weather-rain rain-c" />
            <span className="sample-weather-rain rain-d" />
            <span className="sample-weather-rain rain-e" />
            <span className="sample-weather-rain rain-f" />
            <span className="sample-weather-rain rain-g" />
            <span className="sample-weather-rain rain-h" />
          </>
        )}
        {activeTone === 'snow' && (
          <>
            <span className="sample-weather-cloud cloud-a" />
            <span className="sample-weather-snow snow-a" />
            <span className="sample-weather-snow snow-b" />
            <span className="sample-weather-snow snow-c" />
            <span className="sample-weather-snow snow-d" />
            <span className="sample-weather-snow snow-e" />
            <span className="sample-weather-snow snow-f" />
          </>
        )}
        {activeTone === 'windy' && (
          <>
            <span className="sample-weather-cloud cloud-a" />
            <span className="sample-weather-wind wind-a" />
            <span className="sample-weather-wind wind-b" />
            <span className="sample-weather-wind wind-c" />
            <span className="sample-weather-wind wind-d" />
            <span className="sample-weather-wind wind-e" />
          </>
        )}
        {activeTone === 'storm' && (
          <>
            <span className="sample-weather-cloud cloud-a" />
            <span className="sample-weather-rain rain-a" />
            <span className="sample-weather-rain rain-b" />
            <span className="sample-weather-rain rain-c" />
            <span className="sample-weather-rain rain-d" />
            <span className="sample-weather-rain rain-e" />
            <span className="sample-weather-rain rain-f" />
            <span className="sample-weather-rain rain-g" />
            <span className="sample-weather-rain rain-h" />
            <span className="sample-weather-lightning" />
          </>
        )}
      </div>

      <div className="sample-weather-head">
        <div className="sample-widget-label">Weather</div>
        <div className="sample-weather-updated">{status === 'ready' ? `Updated ${updatedAt}` : 'Live'}</div>
      </div>

      <div className="sample-weather-main">
        <div className="sample-weather-hero">
          <div className="sample-weather-icon-wrap" aria-hidden="true">
              <Icon size={20} strokeWidth={2.1} />
          </div>
          <div className="sample-weather-big">{snapshot ? `${Math.round(snapshot.temp)}°` : '--'}</div>
        </div>

        <div className="sample-weather-metrics">
          <span className="sample-weather-condition">{sceneLabel}</span>
          <span className="sample-weather-range">
            {snapshot ? `H ${Math.round(snapshot.max)}° · L ${Math.round(snapshot.min)}°` : 'H -- · L --'}
          </span>
        </div>
      </div>

      <div className="sample-weather-footer">
        <span>{locationText}</span>
        {snapshot && <span>{Math.round(snapshot.windSpeed)} km/h wind</span>}
      </div>
    </div>
  );
};

export default WeatherWidget;
