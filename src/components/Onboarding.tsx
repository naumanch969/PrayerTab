import React, { useState } from 'react';
import type { UserSettings, CalculationMethod, Location } from '../types';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

const METHODS: { value: CalculationMethod; label: string; region: string }[] = [
  { value: 'MWL',    label: 'Muslim World League',                region: 'Europe, Far East, Americas' },
  { value: 'ISNA',   label: 'Islamic Society of North America',   region: 'North America' },
  { value: 'Egypt',  label: 'Egyptian General Authority',         region: 'Africa, Syria, Lebanon' },
  { value: 'Makkah', label: 'Umm al-Qura (Makkah)',              region: 'Arabian Peninsula' },
  { value: 'Karachi',label: 'University of Islamic Sciences',     region: 'Pakistan, Bangladesh, India' },
  { value: 'Tehran', label: 'Institute of Geophysics, Tehran',   region: 'Iran' },
  { value: 'Shia',   label: 'Shia (Leva Research Institute)',    region: 'Shia Muslims' },
];

type Step = 'name' | 'location' | 'method';
const STEP_ORDER: Step[] = ['name', 'location', 'method'];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [method, setMethod] = useState<CalculationMethod>('MWL');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedLocationLabel, setSelectedLocationLabel] = useState('');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [searchingManual, setSearchingManual] = useState(false);

  const goToLocation = () => {
    if (name.trim()) setStep('location');
  };

  const goToMethod = () => {
    if (selectedLocation) {
      setLocError('');
      setStep('method');
      return;
    }
    setLocError('Please set your location before continuing.');
  };

  const completeSetup = () => {
    if (!selectedLocation) {
      setStep('location');
      setLocError('Please set your location before finishing setup.');
      return;
    }

    onComplete({
      name: name.trim(),
      calculationMethod: method,
      location: selectedLocation,
      onboardingComplete: true,
      hasSeenCustomizePrompt: false,
      enabledWidgets: [],
      widgetLayouts: {},
      widgetPreferences: {},
    });
  };

  const detectLocation = () => {
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setSelectedLocation(location);
        setSelectedLocationLabel(`${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setLocError('Location permission denied. Please allow location and try again.');
        } else if (err.code === 3) {
          setLocError('Detecting location timed out. Please try again.');
        } else {
          setLocError('Could not detect location. You can enter a city manually below.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true },
    );
  };

  const saveManualLocation = async () => {
    if (!manualCity.trim()) return;
    setSearchingManual(true);
    setLocError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualCity)}&limit=1`,
      );

      if (!res.ok) throw new Error('Geocoding request failed.');
      const data = await res.json();

      if (data && data[0]) {
        const city = data[0].display_name.split(',')[0];
        setSelectedLocation({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          city,
        });
        setSelectedLocationLabel(city);
      } else {
        setLocError('City not found. Please try a different name.');
      }
    } catch {
      setLocError('Search failed. Please check your connection.');
    } finally {
      setSearchingManual(false);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        {/* Logo */}
        <div className="ob-logo">
          <span className="ob-logo-arabic">بِسْمِ اللَّهِ</span>
          <span className="ob-logo-name">Prayer Tab</span>
        </div>

        {step === 'name' && (
          <>
            <h1 className="ob-title">Assalamu Alaikum</h1>
            <p className="ob-subtitle">What shall we call you?</p>
            <input
              className="ob-input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToLocation()}
              autoFocus
            />
            <button className="ob-btn" onClick={goToLocation} disabled={!name.trim()}>
              Continue
            </button>
          </>
        )}

        {step === 'location' && (
          <div className="ob-location-step">
            <h1 className="ob-title">Your Location</h1>
            <p className="ob-subtitle">Prayer times are calculated based on your precise location.</p>

            {locError && <p className="ob-error">{locError}</p>}

            <button className="ob-btn" onClick={detectLocation} disabled={locating}>
              {locating ? 'Detecting...' : 'Detect My Location'}
            </button>

            <div className="ob-divider">OR</div>

            <div className="ob-manual-search">
              <input
                aria-label="Enter city"
                type="text"
                className="ob-input-small"
                placeholder="Enter city (e.g. London, Istanbul)"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveManualLocation()}
              />
              <button
                className="ob-btn-secondary"
                onClick={saveManualLocation}
                disabled={searchingManual || !manualCity.trim()}
              >
                {searchingManual ? 'Searching...' : 'Set Manually'}
              </button>
            </div>

            {selectedLocationLabel && (
              <p className="ob-help-text">Selected location: {selectedLocationLabel}</p>
            )}

            <button className="ob-btn" onClick={goToMethod} disabled={!selectedLocation}>
              Continue
            </button>
          </div>
        )}

        {step === 'method' && (
          <>
            <h1 className="ob-title">Calculation Method</h1>
            <p className="ob-subtitle">Choose the method used in your region for accurate prayer times.</p>
            <div className="ob-method-list">
              {METHODS.map((m) => (
                <button
                  key={m.value}
                  className={`ob-method-item ${method === m.value ? 'active' : ''}`}
                  onClick={() => setMethod(m.value)}
                >
                  <span className="ob-method-label">{m.label}</span>
                  <span className="ob-method-region">{m.region}</span>
                </button>
              ))}
            </div>
            <button className="ob-btn" onClick={completeSetup}>Finish Setup</button>
          </>
        )}

        {/* Step indicator */}
        <div className="ob-steps">
          {STEP_ORDER.map((s, i) => (
            <span key={s} className={`ob-step-dot ${step === s ? 'active' : ''} ${STEP_ORDER.indexOf(step) > i ? 'done' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
