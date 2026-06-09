import type { ResultTemplate } from '@/lib/quiz/types';

export const RESULT_NEW: ResultTemplate = {
  profileLabel: 'Producător Digital',
  levelLabel: 'La start',
  headline: 'Tu nu ai nevoie de mai multă informație. Ai nevoie de primul pas corect.',
  sections: [
    { icon: '✦', title: 'Ce funcționează deja la tine', body: 'Dorința de schimbare e reală — și asta e mai rar decât crezi.' },
    { icon: '✦', title: 'Unde e blocajul principal', body: 'Nu lipsa de talente sau timp. Lipsa unui sistem clar, cu o metodă dovedită.' },
    { icon: '✦', title: 'Ce îți lipsește concret', body: 'O profesie digitală clară, un plan pas cu pas, și dovada că funcționează — de la primul euro câștigat ca producător digital.' },
    { icon: '✦', title: 'Următorul pas recomandat', body: 'Am pregătit un material gratuit unde îți arăt exact cum funcționează profesia de producător digital — de la găsirea primului expert la primele venituri.' },
  ],
  socialProof: '',
  cta: {
    HOT: { text: 'Accesează materialul gratuit →', subtext: 'Am pregătit un material complet despre profesia de producător digital — totul, pas cu pas.', action: 'lesson_beginner' },
    WARM: { text: 'Accesează materialul gratuit →', subtext: 'Am pregătit un material complet, pas cu pas, adaptat exact profilului tău.', action: 'lesson_beginner' },
    COLD: { text: 'Accesează materialul gratuit →', subtext: 'Am pregătit un material gratuit unde îți explic pas cu pas cum să începi.', action: 'lesson_beginner' },
  },
};
