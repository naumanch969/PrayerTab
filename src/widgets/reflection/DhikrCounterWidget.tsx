import React, { useState } from 'react';
import type { WidgetComponentProps } from '../types';

const DhikrCounterWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      className="widget-body-counter"
      onClick={() => !isEditMode && setCount((c) => (c + 1) % 100)}
    >
      <span className="widget-body-metric">{count}</span>
      <span className="widget-body-submetric">Tap dhikr</span>
    </button>
  );
};

export default DhikrCounterWidget;
