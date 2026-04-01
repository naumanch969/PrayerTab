import React, { useEffect, useState } from 'react';
import './focus-task/styles.css';
import type { WidgetComponentProps } from '../types';

import { Play, Pause, RotateCcw } from 'lucide-react';

const FocusTaskWidget: React.FC<WidgetComponentProps> = ({ isEditMode, runtime, sizeTier }) => {
  const [task, setTask] = useState(runtime.intention?.text ?? '');
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setTask(runtime.intention?.text ?? '');
  }, [runtime.intention?.text]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((s) => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsActive(false);
    }
    return () => window.clearInterval(interval);
  }, [isActive, timerSeconds]);

  const persistTask = () => {
    if (isEditMode) return;
    void runtime.setIntention(task.trim());
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`focus-task-widget ${sizeTier}`}>
      <div className="focus-task-content" onPointerDown={(e) => e.stopPropagation()}>
        {sizeTier !== 'small' && (
          <div className="focus-task-label">Intention</div>
        )}
        
        <input
          className="focus-task-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onBlur={persistTask}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
              persistTask();
            }
          }}
          readOnly={isEditMode}
          placeholder="What is your focus today?"
        />

        {sizeTier === 'large' && (
          <div className="focus-timer-section">
            <div className="focus-timer-display">{formatTime(timerSeconds)}</div>
            <div className="focus-timer-controls">
              <button onClick={() => setIsActive(!isActive)} className="timer-btn">
                {isActive ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button onClick={() => { setIsActive(false); setTimerSeconds(25 * 60); }} className="timer-btn">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default FocusTaskWidget;
