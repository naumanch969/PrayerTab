import React from 'react';
import type { DhikrState, DhikrType } from '../types';

interface DhikrPanelProps {
  dhikr: DhikrState | null;
  onTap: () => void;
}

const DHIKR_LABELS: Record<DhikrType, { arabic: string; transliteration: string }> = {
  Subhanallah:  { arabic: 'سُبْحَانَ اللَّه', transliteration: 'Subhanallah' },
  Alhamdulillah:{ arabic: 'الْحَمْدُ لِلَّه', transliteration: 'Alhamdulillah' },
  AllahuAkbar:  { arabic: 'اللَّهُ أَكْبَر',  transliteration: 'Allahu Akbar' },
};

const MAX_COUNT = 33;

const DhikrPanel: React.FC<DhikrPanelProps> = ({ dhikr, onTap }) => {
  if (!dhikr) return null;

  const { current, counts } = dhikr;
  const count = counts[current];
  const progress = count / MAX_COUNT;
  const circumference = 2 * Math.PI * 34; // r = 34
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="dhikr-panel">
      <div className="panel-section-label">Dhikr Counter</div>

      <button className="dhikr-ring-btn" onClick={onTap} aria-label={`Count ${current}`}>
        <svg className="dhikr-svg" viewBox="0 0 80 80">
          <circle className="dhikr-track" cx="40" cy="40" r="34" />
          <circle
            className="dhikr-progress"
            cx="40" cy="40" r="34"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="dhikr-center">
          <span className="dhikr-count">{count}</span>
          <span className="dhikr-max">/{MAX_COUNT}</span>
        </div>
      </button>

      <div className="dhikr-label-arabic">{DHIKR_LABELS[current].arabic}</div>
      <div className="dhikr-label-latin">{DHIKR_LABELS[current].transliteration}</div>

      {/* Mini progress dots for the three dhikrs */}
      <div className="dhikr-sequence">
        {(Object.keys(DHIKR_LABELS) as DhikrType[]).map((type) => (
          <div key={type} className={`dhikr-seq-item ${type === current ? 'active' : ''} ${counts[type] >= MAX_COUNT ? 'done' : ''}`}>
            <div className="dhikr-seq-dot" />
            <span className="dhikr-seq-count">{counts[type]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DhikrPanel;
