import type { Question } from '@/lib/quiz/types';

export const Q5_BEG: Question = {
  id: 'Q5_BEG',
  phase: 'Q5',
  text: 'În ce domeniu ești specialist?',
  options: [
    { code: 'sanatate', text: 'Sănătate și wellness (medicină, nutriție, psihologie, coaching)', microValidation: '' },
    { code: 'beauty', text: 'Beauty și îngrijire (make-up, coafură, estetică, skincare)', microValidation: '' },
    { code: 'educatie', text: 'Educație și dezvoltare (limbi străine, materii școlare, soft skills)', microValidation: '' },
    { code: 'business', text: 'Business și vânzări (marketing, antreprenoriat, finanțe)', microValidation: '' },
    { code: 'lifestyle', text: 'Stil de viață și creativitate (fitness, modă, artă, fotografie, gătit)', microValidation: '' },
    { code: 'alt_domeniu', text: 'Alt domeniu', microValidation: '', isOther: true },
  ],
};

export const Q6_BEG: Question = {
  id: 'Q6_BEG',
  phase: 'Q6',
  text: 'Cum te simți când te gândești să vinzi online ceea ce știi să faci?',
  options: [
    { code: 'pregatita', text: 'Mă simt pregătită, dar nu știu care sunt pașii concreți', microValidation: 'Atitudinea e acolo. Hai să construim sistemul în jurul ei.' },
    { code: 'coplesita', text: 'Sunt copleșită — sunt prea multe informații și nu știu de unde să încep', microValidation: 'Informația fără structură creează confuzie. Cu un ghid clar, totul devine simplu.' },
    { code: 'nesigura', text: 'Nu sunt sigură că ceea ce știu eu se poate vinde online', microValidation: 'Dacă ai clienți sau rezultate în offline, expertiza ta are valoare. Trebuie doar să o „împachetezi" corect.' },
    { code: 'frustrare', text: 'Am încercat câte ceva dar nu a funcționat — și nu știu de ce', microValidation: 'Faptul că ai încercat deja te pune înaintea majorității. Data asta, cu metodă, va fi altfel.' },
    { code: 'other', text: 'Alt răspuns...', microValidation: '', isOther: true },
  ],
};

export const Q7_BEG: Question = {
  id: 'Q7_BEG',
  phase: 'Q7',
  text: 'Ce tip de produs digital ți se potrivește cel mai bine?',
  options: [
    {
      code: 'A1',
      text: 'Nu știu — am nevoie de ajutor să aleg formatul potrivit',
      note: { text: 'Nu trebuie să știi acum — alegerea formatului potrivit e primul lucru pe care îl stabilim împreună.' },
      microValidation: '',
    },
    { code: 'A2', text: 'Consultații sau mentorat 1-la-1 (lucru direct cu clienți)', microValidation: '' },
    { code: 'A3', text: 'Curs online (conținut înregistrat, grup de elevi)', microValidation: '' },
    { code: 'A4', text: 'Intensiv sau masterclass (format scurt, rezultat rapid)', microValidation: '' },
  ],
};
