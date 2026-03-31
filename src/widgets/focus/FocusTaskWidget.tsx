import React, { useState } from 'react';
import type { WidgetComponentProps } from '../types';

const FocusTaskWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  const [task, setTask] = useState('Finish deep work block');

  return (
    <input
      className="widget-body-input"
      value={task}
      onChange={(e) => setTask(e.target.value)}
      readOnly={isEditMode}
      placeholder="Today focus task"
    />
  );
};

export default FocusTaskWidget;
