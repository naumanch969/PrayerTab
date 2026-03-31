import React, { useState } from 'react';
import type { WidgetComponentProps } from '../types';

const phrases = ['Subhanallah', 'Alhamdulillah', 'Allahu Akbar'] as const;

const TasbeehWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  const [index, setIndex] = useState(0);

  return (
    <button
      type="button"
      className="widget-body-counter"
      onClick={() => !isEditMode && setIndex((v) => (v + 1) % phrases.length)}
    >
      <span className="widget-body-metric">{phrases[index]}</span>
      <span className="widget-body-submetric">Tap to cycle</span>
    </button>
  );
};

export default TasbeehWidget;
