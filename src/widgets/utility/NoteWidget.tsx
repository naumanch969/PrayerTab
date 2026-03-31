import React, { useState } from 'react';
import type { WidgetComponentProps } from '../types';

const NoteWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  const [text, setText] = useState('Reflect before sleeping...');

  return (
    <textarea
      className="widget-body-textarea"
      value={text}
      readOnly={isEditMode}
      onChange={(e) => setText(e.target.value)}
      rows={3}
    />
  );
};

export default NoteWidget;
