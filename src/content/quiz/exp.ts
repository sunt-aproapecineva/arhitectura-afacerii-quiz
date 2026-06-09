import type { ResultTemplate } from '@/lib/quiz/types';

export const RESULT_EXP: ResultTemplate = {
  profileLabel: 'Specialist cu experiență',
  levelLabel: 'Lansează, dar crește greu',
  headline: 'Ai dovedit că funcționează. Acum e timpul unui sistem care crește fără să te epuizeze.',
  sections: [
    { icon: '✦', title: 'Ce funcționează deja la tine', body: 'Ai lansări, ai vânzări, ai feedback pozitiv. Baza e solidă.' },
    { icon: '✦', title: 'Unde e blocajul principal', body: 'Fiecare flux e de la zero. Nu există un sistem care să capitalizeze pe precedentul.' },
    { icon: '✦', title: 'Ce îți lipsește concret', body: 'Matricea de produse (nu o singură lansare, ci un ecosistem), automatizare parțială, și o strategie de scalare fără dependență de trafic nou.' },
    { icon: '✦', title: 'Următorul pas recomandat', body: 'Am pregătit un material gratuit unde îți arăt cum să treci de la expert care lansează la business care crește flux după flux.' },
  ],
  socialProof: '',
  cta: {
    HOT: { text: 'Accesează materialul gratuit →', subtext: 'Materialul îți arată exact cum să construiești un sistem de scalare sustenabil.', action: 'lesson_expert' },
    WARM: { text: 'Accesează materialul gratuit →', subtext: 'Materialul îți arată pas cu pas cum să treci la următorul nivel.', action: 'lesson_expert' },
    COLD: { text: 'Accesează materialul gratuit →', subtext: 'Am pregătit un material gratuit unde îți explic totul.', action: 'lesson_expert' },
  },
};
