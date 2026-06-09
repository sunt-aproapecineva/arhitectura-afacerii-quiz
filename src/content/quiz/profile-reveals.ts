import type { ProfileRevealContent } from '@/lib/quiz/types';

export const PROFILE_REVEALS: Record<string, ProfileRevealContent> = {
  R: {
    emoji: '🔄',
    title: 'Nu găsești oameni buni.',
    description: 'Angajezi în panică, iei primul disponibil, refaci procesul din nou. Problema nu sunt candidații — e lipsa unui sistem de selecție care să atragă și să filtreze corect.',
  },
  Re: {
    emoji: '📤',
    title: 'Formezi oameni care pleacă.',
    description: 'Investești luni întregi în training. Când omul devine productiv, pleacă. Know-how-ul e în capul oamenilor, nu în procese documentate — și asta e vulnerabilitatea ta principală.',
  },
  M: {
    emoji: '⚖️',
    title: 'Plătești, dar nu primești rezultat.',
    description: 'Angajații vin la program, nu la performanță. Salariu fix fără KPI. Profitul per angajat scade cu fiecare om nou, iar motivarea prin bani nu funcționează fără structura corectă.',
  },
  D: {
    emoji: '🔗',
    title: 'Faci tu totul, că altfel iese prost.',
    description: 'Tu EȘTI businessul. 12+ ore pe zi, telefon mereu pornit. Ai încercat să delegi — tot tu ai refăcut. Firma e dependentă de prezența ta la fiecare decizie mică.',
  },
  C: {
    emoji: '📊',
    title: 'Nu știi ce se întâmplă în firma ta.',
    description: 'Fără cifre clare, fără raportare în timp real, decizii pe instinct. Afli că ceva nu merge abia când e deja dezastru. Pierzi bani fără să știi exact unde.',
  },
  S: {
    emoji: '🌀',
    title: 'Crești, dar totul se complică.',
    description: 'Cifra urcă, echipa crește, haosul crește odată cu ea. Fiecare manager face cum vrea. Nu există organigramă clară sau procese standard — creșterea amplifică problemele existente.',
  },
};
