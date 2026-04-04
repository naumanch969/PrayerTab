import React from 'react';
import { RotateCcw } from 'lucide-react';
import './tasbeeh/styles.css';
import type { WidgetComponentProps } from '../types';

const phrases = ['Subhanallah', 'Alhamdulillah', 'Allahu Akbar'] as const;

const TasbeehWidget: React.FC<WidgetComponentProps> = ({ isEditMode, runtime, sizeTier }) => {
  const current = runtime.dhikr?.current ?? 'Subhanallah';
  const counts = [
    runtime.dhikr?.counts.Subhanallah ?? 0,
    runtime.dhikr?.counts.Alhamdulillah ?? 0,
    runtime.dhikr?.counts.AllahuAkbar ?? 0,
  ];

  const onTap = () => {
    if (isEditMode) return;
    void runtime.tapDhikr();
  };

  return (
    <div className={`tasbeeh-widget ${sizeTier}`}>
      <button type="button" className="tasbeeh-tap-area" onClick={onTap}>
        {sizeTier === 'small' ? (
          <div className="tasbeeh-compact-view">
             <span className="tasbeeh-current">{current}</span>
             <span className="tasbeeh-count">{runtime.dhikr?.counts[current] ?? 0}</span>
          </div>
        ) : (
          <div className="tasbeeh-list-view">
            {phrases.map((phrase, idx) => {
              const count = counts[idx];
              const pct = Math.min((count / 33) * 100, 100);
              const isActive = current === (phrase === 'Allahu Akbar' ? 'AllahuAkbar' : phrase);
              return (
                <div key={phrase} className={`tasbeeh-row ${isActive ? 'active' : ''}`}>
                  <span className="tasbeeh-row-label">{phrase}</span>
                  <span className="tasbeeh-row-count">{count}</span>
                  <div className="tasbeeh-row-progress">
                    <div className="tasbeeh-row-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </button>

      {sizeTier !== 'small' && (
        <button
          className="dhikr-reset-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (isEditMode) return;
            void runtime.resetDhikr();
          }}
          disabled={isEditMode}
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
};


export default TasbeehWidget;
