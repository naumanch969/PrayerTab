import React, { useState, useRef, useEffect } from 'react';

interface IntentionPanelProps {
  intention: string;
  onSave: (text: string) => void;
}

const IntentionPanel: React.FC<IntentionPanelProps> = ({ intention, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(intention);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(intention); }, [intention]);

  const startEdit = () => {
    setEditing(true);
    setDraft(intention);
  };

  const commit = () => {
    setEditing(false);
    onSave(draft.trim());
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') setEditing(false);
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <div className="intention-panel">
      <div className="intention-label">نيّة — Today's Intention</div>
      {editing ? (
        <div className="intention-edit-row">
          <input
            ref={inputRef}
            className="intention-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={commit}
            placeholder="What is your intention today?"
            maxLength={120}
          />
        </div>
      ) : (
        <button
          className={`intention-display ${!intention ? 'placeholder' : ''}`}
          onClick={startEdit}
        >
          {intention || 'Set your intention for the day…'}
        </button>
      )}
    </div>
  );
};

export default IntentionPanel;
