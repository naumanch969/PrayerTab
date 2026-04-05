import React from 'react';
import './bookmarks/styles.css';
import type { WidgetComponentProps } from '../types';

const links: Array<{ label: string; url: string }> = [
  { label: 'Quran', url: 'https://quran.com' },
  { label: 'Prayer API', url: 'https://aladhan.com' },
  { label: 'Prayer Tab Repo', url: 'https://github.com' },
  { label: 'Web Store', url: 'https://chrome.google.com/webstore' },
  { label: 'Open Meteo', url: 'https://open-meteo.com' },
  { label: 'Figma', url: 'https://figma.com' },
];

const BookmarksWidget: React.FC<WidgetComponentProps> = ({ isEditMode }) => {
  return (
    <div className="sample-widget sample-bookmarks">
      <div className="sample-bookmarks-strip" role="list" aria-label="Saved bookmarks">
        {links.map((link) => (
          <button
            key={link.label}
            type="button"
            className="sample-bookmark-badge"
            disabled={isEditMode}
            role="listitem"
            aria-label={`Open ${link.label}`}
            onClick={() => {
              if (isEditMode) return;
              window.open(link.url, '_blank', 'noopener,noreferrer');
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookmarksWidget;
