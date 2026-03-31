import React from 'react';
import './bookmarks/styles.css';
import type { WidgetComponentProps } from '../types';

const links = [
  { label: 'Quran.com', host: 'quran.com', url: 'https://quran.com' },
  { label: 'GitHub Prayer Tab', host: 'github.com', url: 'https://github.com' },
  { label: 'Aladhan API', host: 'aladhan.com', url: 'https://aladhan.com' },
  { label: 'Chrome Dashboard', host: 'chrome.google.com', url: 'https://chrome.google.com/webstore' },
];

const BookmarksWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  return (
    <div className="sample-widget sample-bookmarks">
      <div className="sample-widget-label">Bookmarks</div>
      <div className="sample-bookmark-list">
        {links.map((link) => (
          <button
            key={link.label}
            type="button"
            className="sample-bookmark-row"
            disabled={isEditMode}
            onClick={() => {
              if (isEditMode) return;
              window.open(link.url, '_blank', 'noopener,noreferrer');
            }}
          >
            <span className="sample-bookmark-dot" />
            <span>{link.label}</span>
            <small>{link.host}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookmarksWidget;
