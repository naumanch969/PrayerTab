import React, { useEffect, useState } from 'react';
import './note/styles.css';
import type { WidgetComponentProps } from '../types';

const NOTE_STORAGE_KEY = 'prayertab-widget-note';

const NoteWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  const [text, setText] = useState('Reflect before sleeping...');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NOTE_STORAGE_KEY);
      if (saved) setText(saved);
    } catch {
      // Ignore storage failures in restricted browser contexts.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTE_STORAGE_KEY, text);
    } catch {
      // Ignore storage failures in restricted browser contexts.
    }
  }, [text]);

  return (
    <div className="sample-widget sample-note">
      <div className="sample-widget-label">Note</div>
      <div className="sample-note-wrap">
        <textarea
          className="sample-note-input"
          value={text}
          readOnly={isEditMode}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>
      <div className="sample-note-meta">Saved locally</div>
    </div>
  );
};

export default NoteWidget;
