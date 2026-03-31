import React, { useEffect, useState } from 'react';
import type { WidgetComponentProps } from '../types';

const FocusTaskWidget: React.FC<WidgetComponentProps> = ({ isEditMode, runtime }) => {
  const [task, setTask] = useState(runtime.intention?.text ?? '');

  useEffect(() => {
    setTask(runtime.intention?.text ?? '');
  }, [runtime.intention?.text]);

  const persistTask = () => {
    if (isEditMode) return;
    void runtime.setIntention(task.trim());
  };

  return (
    <div className="sample-widget sample-focus-task">
      <div className="sample-widget-label">Focus Task</div>
      <div className="sample-widget-sub">Today's intention</div>
      <div className="sample-focus-input-wrap">
        <input
          className="sample-focus-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onBlur={persistTask}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              persistTask();
            }
          }}
          readOnly={isEditMode}
          placeholder="Today focus task"
        />
      </div>
      <div className="sample-focus-meta"><span />Set for today</div>
    </div>
  );
};

export default FocusTaskWidget;
