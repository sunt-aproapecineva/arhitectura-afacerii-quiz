import type { Question } from '@/lib/quiz/types';

export const Q5_EXP: Question = {
  id: 'Q5_EXP',
  phase: 'Q5',
  text: 'Câți urmăritori / abonați ai pe pagina ta principală?',
  subtitle: 'Numărul de urmăritori nu determină cât poți câștiga. Mia a generat 2.300€ cu o pagină mică în nișa nails. Dar contează pentru a înțelege cu ce resurse lucrăm.',
  options: [
    { code: 'A1', text: '100 – 500', microValidation: '' },
    { code: 'A2', text: '500 – 1.000', microValidation: '' },
    { code: 'A3', text: '1.000 – 5.000', microValidation: '' },
    { code: 'A4', text: '5.000 – 20.000', microValidation: '' },
    { code: 'A5', text: 'Peste 20.000', microValidation: '' },
  ],
};

export const Q6_EXP: Question = {
  id: 'Q6_EXP',
  phase: 'Q6',
  text: 'Cum te simți acum vis-a-vis de rezultatele tale din online?',
  options: [
    { code: 'frustrata', text: 'Muncesc mult la conținut dar nu văd recompensa financiară — e frustrant', microValidation: 'Frustrarea asta e dovada că știi că poți mai mult. E un semn bun.' },
    { code: 'haos', text: 'Fiecare lansare e haotică — nu am un sistem care funcționează constant', microValidation: 'Haosul nu e lipsă de voință. E lipsă de sistem potrivit.' },
    { code: 'nereprezentata', text: 'Simt că rezultatele mele nu reflectă cât de bună sunt în ce fac', microValidation: 'Rezultatele tale merită să reflecte expertiza ta reală. Asta se construiește cu strategie.' },
    { code: 'plan_clar', text: 'Aș putea x2-x3 dacă aș avea un plan clar de scalare', microValidation: 'Disciplina fără direcție e efort irosit. Un plan clar schimbă totul.' },
    { code: 'other', text: 'Altele...', microValidation: '', isOther: true },
  ],
};

export const Q7_EXP: Question = {
  id: 'Q7_EXP',
  phase: 'Q7',
  text: 'Ce vrei să obții în următoarele luni?',
  multiSelect: true,
  options: [
    { code: 'A1', text: 'Să dublez / triplez cifra de afaceri din online', microValidation: '' },
    { code: 'A2', text: 'Un sistem de vânzări care funcționează constant, nu doar la lansări', microValidation: '' },
    { code: 'A3', text: 'O lansare strategică cu rezultate pe măsură', microValidation: '' },
    { code: 'A4', text: 'Să nu mai depind de prezența mea constantă ca să se vândă', microValidation: '' },
    { code: 'A5', text: 'Să construiesc un ecosistem de produse care se susțin reciproc', microValidation: '' },
    { code: 'other', text: 'Altele...', microValidation: '', isOther: true },
  ],
};
