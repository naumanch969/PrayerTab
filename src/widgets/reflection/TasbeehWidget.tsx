import React from 'react';
import './tasbeeh/styles.css';
import type { WidgetComponentProps } from '../types';

const phrases = ['Subhanallah', 'Alhamdulillah', 'Allahu Akbar'] as const;

const TasbeehWidget: React.FC<WidgetComponentProps> = ({ isEditMode, runtime }) => {
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
    <button
      type="button"
      className="sample-widget sample-tasbeeh"
      onClick={onTap}
    >
      <span className="sample-widget-label">Tasbeeh</span>
      {phrases.map((phrase, idx) => (
        <span key={phrase} className="sample-tasbeeh-row">
          <span>{phrase}</span>
          <span>{counts[idx]}</span>
          <span className="sample-progress-bar compact"><span style={{ width: `${Math.min((counts[idx] / 33) * 100, 100)}%` }} /></span>
        </span>
      ))}
    </button>
  );
};

export default TasbeehWidget;
