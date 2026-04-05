/**
 * Daily Ayah pool — 30 curated verses, one per day of the Hijri month.
 * Arabic text, English translation (Sahih International), Surah + Ayah reference.
 */

import type { Ayah } from '../types';

export const AYAHS: Ayah[] = [
  {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    surah: 'Al-Fatihah', ayahNumber: 1,
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: 'All praise is due to Allah, Lord of the worlds.',
    surah: 'Al-Fatihah', ayahNumber: 2,
  },
  {
    arabic: 'وَبَشِّرِ الصَّابِرِينَ',
    translation: 'And give good tidings to the patient.',
    surah: 'Al-Baqarah', ayahNumber: 155,
  },
  {
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    translation: 'Indeed, Allah is with the patient.',
    surah: 'Al-Baqarah', ayahNumber: 153,
  },
  {
    arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ',
    translation: 'And do not despair of the mercy of Allah. Indeed, no one despairs of the mercy of Allah except the disbelieving people.',
    surah: 'Yusuf', ayahNumber: 87,
  },
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship will be ease.',
    surah: 'Ash-Sharh', ayahNumber: 5,
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'And whoever relies upon Allah — then He is sufficient for him.',
    surah: 'At-Talaq', ayahNumber: 3,
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    translation: 'Indeed, Allah does not allow to be lost the reward of those who do good.',
    surah: 'At-Tawbah', ayahNumber: 120,
  },
  {
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    translation: 'And when My servants ask you concerning Me — indeed I am near.',
    surah: 'Al-Baqarah', ayahNumber: 186,
  },
  {
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Verily, in the remembrance of Allah do hearts find rest.',
    surah: 'Ar-Ra\'d', ayahNumber: 28,
  },
  {
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    translation: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.',
    surah: 'Al-Baqarah', ayahNumber: 201,
  },
  {
    arabic: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ',
    translation: 'And my success is not but through Allah. Upon Him I have relied.',
    surah: 'Hud', ayahNumber: 88,
  },
  {
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
    translation: 'O you who have believed, seek help through patience and prayer.',
    surah: 'Al-Baqarah', ayahNumber: 153,
  },
  {
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    translation: 'Say, "He is Allah, [who is] One."',
    surah: 'Al-Ikhlas', ayahNumber: 1,
  },
  {
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    translation: 'And He is with you wherever you are.',
    surah: 'Al-Hadid', ayahNumber: 4,
  },
  {
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    surah: 'Al-Baqarah', ayahNumber: 255,
  },
  {
    arabic: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
    translation: 'And We are closer to him than his jugular vein.',
    surah: 'Qaf', ayahNumber: 16,
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship will be ease.',
    surah: 'Ash-Sharh', ayahNumber: 6,
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    translation: 'So remember Me; I will remember you.',
    surah: 'Al-Baqarah', ayahNumber: 152,
  },
  {
    arabic: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ',
    translation: 'And Allah loves the steadfast.',
    surah: 'Aal-e-Imran', ayahNumber: 146,
  },
  {
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation: 'Sufficient for us is Allah, and He is the best Disposer of affairs.',
    surah: 'Aal-e-Imran', ayahNumber: 173,
  },
  {
    arabic: 'وَأَنَّ إِلَىٰ رَبِّكَ الْمُنتَهَىٰ',
    translation: 'And that to your Lord is the finality.',
    surah: 'An-Najm', ayahNumber: 42,
  },
  {
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: 'Allah does not burden a soul beyond that it can bear.',
    surah: 'Al-Baqarah', ayahNumber: 286,
  },
  {
    arabic: 'إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ',
    translation: 'Indeed, Allah loves those who rely upon Him.',
    surah: 'Aal-e-Imran', ayahNumber: 159,
  },
  {
    arabic: 'وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ',
    translation: 'And whoever believes in Allah — He will guide his heart.',
    surah: 'At-Taghabun', ayahNumber: 11,
  },
  {
    arabic: 'إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ',
    translation: 'Indeed, Allah is Forgiving and Merciful.',
    surah: 'Al-Baqarah', ayahNumber: 173,
  },
  {
    arabic: 'وَهُوَ الْغَفُورُ الرَّحِيمُ',
    translation: 'And He is the Forgiving, the Merciful.',
    surah: 'Yunus', ayahNumber: 107,
  },
  {
    arabic: 'إِنَّ اللَّهَ لَطِيفٌ بِعِبَادِهِ',
    translation: 'Indeed, Allah is Subtle with His servants.',
    surah: 'Ash-Shura', ayahNumber: 19,
  },
  {
    arabic: 'وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ',
    translation: 'And above every possessor of knowledge is the All-Knowing.',
    surah: 'Yusuf', ayahNumber: 76,
  },
  {
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    translation: 'My Lord, expand for me my breast and ease for me my task.',
    surah: 'Ta-Ha', ayahNumber: 25,
  },
];

/**
 * Returns the Ayah for today — deterministic based on the day of the Hijri month.
 * The index cycles over the pool, so each day of the month gets a unique verse.
 */
export function getDailyAyah(hijriDay: number): Ayah {
  const index = (hijriDay - 1) % AYAHS.length;
  return AYAHS[index];
}

export function getDailyAyahWithOffset(hijriDay: number, offset: number): Ayah {
  const normalizedOffset = ((offset % AYAHS.length) + AYAHS.length) % AYAHS.length;
  const index = (hijriDay - 1 + normalizedOffset) % AYAHS.length;
  return AYAHS[index];
}
