import React from 'react';
import type { WidgetComponentProps } from '../types';
import { RotateCcw } from 'lucide-react';
import './dhikr-counter/styles.css';

const formatDhikrLabel = (value: string) => (value === 'AllahuAkbar' ? 'Allahu Akbar' : value);

const DhikrCounterWidget: React.FC<WidgetComponentProps> = ({ isEditMode, runtime, sizeTier }) => {
  const current = runtime.dhikr?.current ?? 'Subhanallah';
  const count = runtime.dhikr?.counts[current] ?? 0;
  const streak = runtime.dhikr?.streak ?? 0;
  const todayTotal = runtime.dhikr?.todayTotal ?? 0;
  const cycleMax = 33;
  const pct = Math.min(((count % cycleMax) / cycleMax) * 100, 100);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) return;
    void runtime.resetDhikr();
  };

  return (
    <div className={`dhikr-widget ${sizeTier}`}>
      <div className="dhikr-meta" aria-hidden="true">
        <span className="dhikr-streak-chip">{streak}d streak</span>
        <div className="dhikr-meta-actions">
          <span className="dhikr-total-chip">today {todayTotal}</span>
          {sizeTier !== 'small' && (
            <button type="button" className="dhikr-reset-btn" onClick={handleReset} disabled={isEditMode}>
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

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
      
    </div>
  );
};


export default DhikrCounterWidget;
