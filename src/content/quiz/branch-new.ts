import type { Question } from '@/lib/quiz/types';

export const Q5_NEW: Question = {
  id: 'Q5_NEW',
  phase: 'Q5',
  text: 'Cum câștigi bani la moment?',
  options: [
    { code: 'A1', text: 'Am un job / sunt angajată și vreau un venit suplimentar', microValidation: '' },
    { code: 'A2', text: 'Sunt casnică / în concediu de maternitate — nu câștig nimic propriu', microValidation: '' },
    { code: 'A3', text: 'Lucrez pe cont propriu, dar offline / fără prezență online', microValidation: '' },
    { code: 'A4', text: 'Sunt studentă / la început de drum', microValidation: '' },
  ],
};

export const Q6_NEW: Question = {
  id: 'Q6_NEW',
  phase: 'Q6',
  text: 'Cum te simți cel mai des când te gândești la independența ta financiară?',
  options: [
    { code: 'frustrata', text: 'Frustrată — știu că pot mai mult, dar nu știu cum să încep', microValidation: 'Frustrarea asta e dovada că știi că poți mai mult. E un semn bun.' },
    { code: 'speriata', text: 'Speriată — îmi e teamă să încerc și să nu iasă nimic', microValidation: 'Frica de a încerca și a nu reuși e normală. Ce o reduce e claritatea pasului următor.' },
    { code: 'blocata', text: 'Blocată — vreau schimbare, dar nu am timp sau resurse', microValidation: 'Blocajul nu e lipsă de voință. E lipsă de sistem potrivit.' },
    { code: 'hotarata', text: 'Hotărâtă — sunt pregătită, am nevoie doar de direcție clară', microValidation: 'Atitudinea e acolo. Hai să construim sistemul în jurul ei.' },
  ],
};

export const Q7_NEW: Question = {
  id: 'Q7_NEW',
  phase: 'Q7',
  text: 'Ce ți-ar schimba viața cel mai mult în următoarele 12 luni?',
  options: [
    { code: 'A1', text: 'Să câștig primii bani ca producător digital', microValidation: '' },
    { code: 'A2', text: 'Să nu mai depind financiar de soț / părinți / job', microValidation: '' },
    { code: 'A3', text: 'Să am o colaborare stabilă cu un expert pe care îl ajut să vândă', microValidation: '' },
    { code: 'A4', text: 'Să am un sistem care îmi aduce venit lunar fără să fiu prezentă 24/7', microValidation: '' },
  ],
};
