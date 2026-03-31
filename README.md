# PrayerTab

A spiritual new-tab dashboard for Muslims focused on prayer awareness, reflection, and intentional daily flow.

## What it does
- Guides first-run setup for name, location, and prayer calculation method
- Shows widget-based Salah and reflection tools on your new tab
- Supports a customizable widget canvas (add, remove, move, resize)
- Persists your layout and core states locally in browser storage

## Core Widgets
- Prayer Times
- Next Prayer Countdown
- Hijri Date
- Qibla Compass
- Ramadan Countdown
- Daily Ayah
- Dhikr Counter / Tasbeeh
- Focus Task
- Prayer Streak
- Weather
- Bookmarks
- Note

## Local-First Philosophy
User settings and daily state are stored locally. The extension uses network requests only for selected external data sources (for example geocoding, background images, and weather APIs).

## Release Assets
- License: `MIT` in `LICENSE`
- App icons:
	- `public/icons/icon16.png`
	- `public/icons/icon32.png`
	- `public/icons/icon48.png`
	- `public/icons/icon128.png`
- Brand logo: `public/icons/logo.svg`

## Permissions Rationale
- `storage`: persists user settings, widget layout, and local state.
- `geolocation`: computes location-aware prayer and weather data.
- Host permissions:
	- `https://nominatim.openstreetmap.org/*` for city-to-coordinate lookup.
	- `https://api.open-meteo.com/*` for weather widget data.
	- `https://images.unsplash.com/*` and `https://loremflickr.com/*` for background imagery sources.
