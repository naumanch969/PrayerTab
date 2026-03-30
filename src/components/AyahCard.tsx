import React from 'react';
import type { Ayah } from '../types';

interface AyahCardProps {
  ayah: Ayah;
}

const AyahCard: React.FC<AyahCardProps> = ({ ayah }) => (
  <div className="ayah-card">
    <div className="ayah-arabic">{ayah.arabic}</div>
    <div className="ayah-divider" />
    <div className="ayah-translation">{ayah.translation}</div>
    <div className="ayah-ref">— {ayah.surah} {ayah.ayahNumber}</div>
  </div>
);

export default AyahCard;
