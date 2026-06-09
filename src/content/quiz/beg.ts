import type { ResultTemplate } from '@/lib/quiz/types';

export const RESULT_BEG: ResultTemplate = {
  profileLabel: 'Specialist începător online',
  levelLabel: 'Are expertiză, nu are produs digital',
  headline: 'Expertiza ta există deja. Ce îi lipsește e un sistem de livrare care funcționează online.',
  sections: [
    { icon: '✦', title: 'Ce funcționează deja la tine', body: 'Ai rezultate în domeniul tău. Clienți reali, dovezi reale — asta e fundația unui produs digital solid.' },
    { icon: '✦', title: 'Unde e blocajul principal', body: 'Mulți specialiști extraordinari nu știu cum să transforme ce fac 1-la-1 într-un produs care se vinde la scară.' },
    { icon: '✦', title: 'Ce îți lipsește concret', body: 'Formatul de produs potrivit domeniului tău, o strategie de lansare adaptată, și primii clienți online care să valideze.' },
    { icon: '✦', title: 'Următorul pas recomandat', body: 'Am pregătit un material gratuit unde îți arăt exact cum să construiești primul tău produs digital și să îl lansezi cu rezultate reale.' },
  ],
  socialProof: '',
  cta: {
    HOT: { text: 'Accesează materialul gratuit →', subtext: 'Materialul îți arată exact cum să transformi expertiza ta într-un produs digital profitabil.', action: 'lesson_expert' },
    WARM: { text: 'Accesează materialul gratuit →', subtext: 'Materialul îți arată pas cu pas cum să faci prima lansare.', action: 'lesson_expert' },
    COLD: { text: 'Accesează materialul gratuit →', subtext: 'Am pregătit un material gratuit unde îți explic totul.', action: 'lesson_expert' },
  },
};
