import React, { useEffect, useMemo, useState } from 'react';
import './weather/styles.css';
import type { WidgetComponentProps } from '../types';

interface WeatherSnapshot {
  temp: number;
  max: number;
  min: number;
  weatherCode: number;
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

const WeatherWidget: React.FC<WidgetComponentProps> = ({ settings }) => {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

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
        const max = Number(data?.daily?.temperature_2m_max?.[0]);
        const min = Number(data?.daily?.temperature_2m_min?.[0]);
        if ([temp, weatherCode, max, min].some((n) => Number.isNaN(n))) {
          setSnapshot(null);
          setStatus('error');
          return;
        }

        setSnapshot({ temp, weatherCode, max, min });
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

  return (
    <div className="sample-widget sample-weather">
      <div className="sample-widget-label">Weather</div>
      <div className="sample-weather-row">
        <div className="sample-weather-big">{snapshot ? `${Math.round(snapshot.temp)}°` : '--'}</div>
        <div className="sample-weather-metrics">
          <span>{weatherLabel}</span>
          <span>
            {snapshot
              ? `H: ${Math.round(snapshot.max)}° · L: ${Math.round(snapshot.min)}°`
              : 'H: -- · L: --'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
