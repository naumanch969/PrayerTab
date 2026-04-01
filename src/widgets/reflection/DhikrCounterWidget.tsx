import React from 'react';
import type { WidgetComponentProps } from '../types';
import { RotateCcw } from 'lucide-react';
import './dhikr-counter/styles.css';

const formatDhikrLabel = (value: string) => (value === 'AllahuAkbar' ? 'Allahu Akbar' : value);

const DhikrCounterWidget: React.FC<WidgetComponentProps> = ({ isEditMode, runtime, sizeTier }) => {
  const current = runtime.dhikr?.current ?? 'Subhanallah';
  const count = runtime.dhikr?.counts[current] ?? 0;
  const cycleMax = 33;
  const pct = Math.min(((count % cycleMax) / cycleMax) * 100, 100);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) return;
    void runtime.resetDhikr();
  };

  return (
    <div className={`dhikr-widget ${sizeTier}`}>
      <button
        type="button"
        className="dhikr-tap-area"
        onClick={() => {
          if (isEditMode) return;
          void runtime.tapDhikr();
        }}
      >
        <span className="dhikr-label">{formatDhikrLabel(current)}</span>
        <span className="dhikr-count">{count}</span>
        <div className="dhikr-progress-ring">
           <div className="dhikr-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </button>
      
      {sizeTier !== 'small' && (
        <button className="dhikr-reset-btn" onClick={handleReset} disabled={isEditMode}>
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
};


export default DhikrCounterWidget;
