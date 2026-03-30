import React, { useState } from 'react';
import type { UserSettings, CalculationMethod } from '../types';

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

type Step = 'name' | 'method' | 'location';

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [method, setMethod] = useState<CalculationMethod>('MWL');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const goToMethod = () => { if (name.trim()) setStep('method'); };
  const goToLocation = () => setStep('location');

  const detectLocation = () => {
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onComplete({
          name: name.trim(),
          calculationMethod: method,
          location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          onboardingComplete: true,
        });
      },
      () => {
        setLocating(false);
        setLocError('Could not detect location. Please allow location access and try again.');
      },
      { timeout: 8000 },
    );
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
              onKeyDown={(e) => e.key === 'Enter' && goToMethod()}
              autoFocus
            />
            <button className="ob-btn" onClick={goToMethod} disabled={!name.trim()}>
              Continue
            </button>
          </>
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
            <button className="ob-btn" onClick={goToLocation}>Continue</button>
          </>
        )}

        {step === 'location' && (
          <>
            <h1 className="ob-title">Your Location</h1>
            <p className="ob-subtitle">Prayer times are calculated based on your precise location.</p>
            {locError && <p className="ob-error">{locError}</p>}
            <button className="ob-btn" onClick={detectLocation} disabled={locating}>
              {locating ? 'Detecting…' : '📍 Allow Location Access'}
            </button>
          </>
        )}

        {/* Step indicator */}
        <div className="ob-steps">
          {(['name', 'method', 'location'] as Step[]).map((s, i) => (
            <span key={s} className={`ob-step-dot ${step === s ? 'active' : ''} ${(['name', 'method', 'location'] as Step[]).indexOf(step) > i ? 'done' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
