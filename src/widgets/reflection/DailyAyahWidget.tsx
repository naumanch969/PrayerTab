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

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState({ width: 0, height: 0 });
  const [bookmarked, setBookmarked] = useState(false);
  const [shareDone, setShareDone] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setFrame({ width, height });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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

  const ratio = frame.height > 0 ? frame.width / frame.height : 1;
  const isPortrait = ratio < 0.92;
  const isWide = ratio > 1.45;
  const isCompact = frame.width < 320 || frame.height < 195;
  const hideTranslation = isCompact && sizeTier === 'small';
  const showActionsLabel = !isCompact && !isWide;

  const shareText = `"${ayah.translation}" (${ayah.surah} ${ayah.ayahNumber})`;

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

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Daily Ayah',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
      setShareDone(true);
    } catch {
      // Ignore canceled share prompts.
    }
  };

  const openTafsir = () => {
    if (isEditMode || !surahNumber) return;
    window.open(`https://quran.com/${surahNumber}:${ayah.ayahNumber}/tafsirs/en-tafisr-ibn-kathir`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={rootRef}
      className={`sample-widget sample-ayah ${isPortrait ? 'is-portrait' : ''} ${isWide ? 'is-wide' : ''} ${isCompact ? 'is-compact' : ''}`}
    >
      <div className="sample-ayah-fog" />
      <div className="sample-ayah-star" aria-hidden="true">✦</div>

      <div className="sample-widget-label">Daily Ayah</div>

      <div className="sample-ayah-arabic-wrap">
        <div className="sample-ayah-arabic">{ayah.arabic}</div>
      </div>

      {!hideTranslation && (
        <div className="sample-ayah-translation-wrap">
          <div className="sample-ayah-translation">"{ayah.translation}"</div>
        </div>
      )}

      <div className="sample-ayah-footer">
        <div className="sample-ayah-source">
          <span className="sample-ayah-line" />
          <div className="sample-ayah-ref-wrap">
            <div className="sample-ayah-surah">{ayah.surah}</div>
            <div className="sample-ayah-ref">Surah {surahNumber ?? '?'} · Ayah {ayah.ayahNumber}</div>
          </div>
        </div>

        <div className="sample-ayah-actions" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" className="sample-ayah-action-btn" onClick={() => void onShare()} disabled={isEditMode} title="Share ayah">
            {shareDone ? <Check size={15} /> : <Share2 size={15} />}
          </button>

          <button type="button" className={`sample-ayah-action-btn ${bookmarked ? 'active' : ''}`} onClick={toggleBookmark} disabled={isEditMode} title="Bookmark ayah">
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>

          <button type="button" className="sample-ayah-tafsir-btn" onClick={openTafsir} disabled={isEditMode || !surahNumber} title="Read tafsir">
            <BookOpenText size={14} />
            {showActionsLabel && <span>Read Tafsir</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyAyahWidget;
