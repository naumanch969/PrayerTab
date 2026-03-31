import React from 'react';
import type { WidgetComponentProps } from '../types';

const links = ['YouTube', 'Gmail', 'Docs'];

const BookmarksWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  return (
    <div className="widget-body-bookmarks">
      {links.map((label) => (
        <button key={label} type="button" className="widget-body-chip" disabled={isEditMode}>
          {label}
        </button>
      ))}
    </div>
  );
};

export default BookmarksWidget;
