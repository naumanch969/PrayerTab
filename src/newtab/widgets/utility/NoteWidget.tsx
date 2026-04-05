import React, { useEffect, useState } from 'react';
import './note/styles.css';
import type { WidgetComponentProps } from '../types';

const NOTE_STORAGE_KEY = 'prayertab-widget-note';

const NOTE_FONT_SIZES = {
  small: 'note-font-small',
  medium: 'note-font-medium',
  large: 'note-font-large',
} as const;

const NoteWidget: React.FC<WidgetComponentProps> = ({ isEditMode, settings }) => {
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

  const noteFontSize = NOTE_FONT_SIZES[(settings.widgetPreferences.note?.noteFontSize ?? 'medium') as keyof typeof NOTE_FONT_SIZES];

  return (
    <div className={`sample-widget sample-note ${noteFontSize}`}>
      <div className="sample-note-head">
        <span className="sample-widget-label">Note</span>
        <span className="sample-note-pill">Saved locally</span>
      </div>

      <div className="sample-note-paper">
        <textarea
          className="sample-note-input"
          value={text}
          readOnly={isEditMode}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          aria-label="Personal note"
        />
        <div className="sample-note-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="sample-note-meta">Reflect before sleeping…</div>
    </div>
  );
};

export default NoteWidget;
