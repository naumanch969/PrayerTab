import React, { useEffect, useMemo, useRef, useState } from 'react';
import './daily-ayah/styles.css';
import { BookOpenText, Bookmark, Check, Share2 } from 'lucide-react';
import { getDailyAyah } from '../../lib/quran';
import { toHijri } from '../../lib/hijri';
import type { WidgetComponentProps } from '../types';

const DAILY_AYAH_BOOKMARKS_KEY = 'prayertab-daily-ayah-bookmarks';

const SURAH_NUMBER: Record<string, number> = {
  'Al-Fatihah': 1,
  'Al-Baqarah': 2,
  'Aal-e-Imran': 3,
  'At-Tawbah': 9,
  Yusuf: 12,
  'Ar-Ra\'d': 13,
  Hud: 11,
  'Ta-Ha': 20,
  'Al-Ikhlas': 112,
  'Al-Hadid': 57,
  Qaf: 50,
  Yunus: 10,
  'At-Talaq': 65,
  'At-Taghabun': 64,
  'Ash-Shura': 42,
  'An-Najm': 53,
  'Ash-Sharh': 94,
};

const DailyAyahWidget: React.FC<WidgetComponentProps> = ({ sizeTier, isEditMode }) => {
  const h = toHijri(new Date());
  const ayah = getDailyAyah(h.day);
  const surahNumber = SURAH_NUMBER[ayah.surah] ?? null;
  const ayahId = `${ayah.surah}:${ayah.ayahNumber}`;

  const [bookmarked, setBookmarked] = useState(false);
  const [shareDone, setShareDone] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(DAILY_AYAH_BOOKMARKS_KEY);
    if (!raw) {
      setBookmarked(false);
      return;
    }
    try {
      const bookmarks = JSON.parse(raw) as string[];
      setBookmarked(bookmarks.includes(ayahId));
    } catch {
      setBookmarked(false);
    }
  }, [ayahId]);

  useEffect(() => {
    if (!shareDone) return;
    const timeout = window.setTimeout(() => setShareDone(false), 1100);
    return () => window.clearTimeout(timeout);
  }, [shareDone]);

  const toggleBookmark = () => {
    if (isEditMode) return;
    const raw = window.localStorage.getItem(DAILY_AYAH_BOOKMARKS_KEY);
    let bookmarks: string[] = [];
    if (raw) {
      try {
        bookmarks = JSON.parse(raw) as string[];
      } catch {
        bookmarks = [];
      }
    }
    const next = bookmarks.includes(ayahId)
      ? bookmarks.filter((id) => id !== ayahId)
      : [...bookmarks, ayahId];
    window.localStorage.setItem(DAILY_AYAH_BOOKMARKS_KEY, JSON.stringify(next));
    setBookmarked(next.includes(ayahId));
  };

  const onShare = async () => {
    if (isEditMode) return;
    const shareText = `"${ayah.translation}" (${ayah.surah} ${ayah.ayahNumber})`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Daily Ayah', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
      setShareDone(true);
    } catch {}
  };

  const openTafsir = () => {
    if (isEditMode || !surahNumber) return;
    window.open(`https://quran.com/${surahNumber}:${ayah.ayahNumber}/tafsirs/en-tafisr-ibn-kathir`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`ayah-widget ${sizeTier}`}>
      <div className="ayah-fog" />
      <div className="ayah-header">
        <span className="ayah-badge">Daily Ayah</span>
        {sizeTier === 'large' && <span className="ayah-hijri">{h.day} {h.month} {h.year}</span>}
      </div>

      <div className="ayah-scroll-area">
        <div className="ayah-arabic">{ayah.arabic}</div>
        {sizeTier !== 'small' && (
          <div className="ayah-translation">"{ayah.translation}"</div>
        )}
      </div>

      <div className="ayah-footer" onPointerDown={e => e.stopPropagation()}>
        <div className="ayah-ref">
          <div className="ayah-surah-name">{ayah.surah}</div>
          <div className="ayah-surah-meta">Ayah {ayah.ayahNumber}</div>
        </div>

        <div className="ayah-controls">
          <button className="ayah-btn" onClick={onShare}>
            {shareDone ? <Check size={14} /> : <Share2 size={14} />}
          </button>
          <button className={`ayah-btn ${bookmarked ? 'active' : ''}`} onClick={toggleBookmark}>
            <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          {sizeTier !== 'small' && (
            <button className="ayah-tafsir-btn" onClick={openTafsir}>
              <BookOpenText size={14} />
              {sizeTier === 'large' && <span>Tafsir</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default DailyAyahWidget;
