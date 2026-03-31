import React from 'react';
import type { WidgetComponentProps } from '../types';

const formatDhikrLabel = (value: string) => (value === 'AllahuAkbar' ? 'Allahu Akbar' : value);

const DhikrCounterWidget: React.FC<WidgetComponentProps> = ({ isEditMode, runtime }) => {
  const current = runtime.dhikr?.current ?? 'Subhanallah';
  const count = runtime.dhikr?.counts[current] ?? 0;
  const cycleMax = 33;
  const pct = Math.min(((count % cycleMax) / cycleMax) * 100, 100);

  return (
    <button
      type="button"
      className="sample-widget sample-dhikr"
      onClick={() => {
        if (isEditMode) return;
        void runtime.tapDhikr();
      }}
    >
      <span className="sample-widget-label">Dhikr Counter</span>
      <span className="sample-dhikr-count">{count}</span>
      <span className="sample-widget-sub">{formatDhikrLabel(current)}</span>
      <span className="sample-progress-bar"><span style={{ width: `${pct}%` }} /></span>
    </button>
  );
};

export default DhikrCounterWidget;
