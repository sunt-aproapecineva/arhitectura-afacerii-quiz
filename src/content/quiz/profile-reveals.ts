import type { ProfileRevealContent } from '@/lib/quiz/types';

// Cadrul ecranului de reveal — onest: numim tiparul, spunem ce mai avem de cartografiat.
// (Niciodată „știm dar nu-ți spunem" — open loop-ul e planul, nu diagnosticul.)
export const REVEAL_FRAME = {
  eyebrow: 'Analiza ta preliminară',
  scanning: 'Recunoaștem tiparul…',
  openLoop: 'Urmează partea care contează: cât te costă și ce facem cu asta. Câteva răspunsuri și îți construiesc planul.',
  button: 'Hai să confirmăm →',
};

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

// Ramura B — reveal parțial, demnitar: omul trebuie să se simtă VĂZUT, nu judecat.
export const B_PROFILE_REVEALS: Record<string, ProfileRevealContent> = {
  ANGAJAT: {
    emoji: '🧭',
    title: 'Nu ești fricos. Ești precaut din motive bune.',
    description: 'Ai ceva de pierdut — de-asta cântărești atât. Răspunsurile tale arată un om care pregătește o tranziție, nu un salt în gol.',
  },
  ARS: {
    emoji: '🔥',
    title: 'Ai mai construit o dată. Asta contează.',
    description: 'Văd un om care a plătit deja taxa de intrare în antreprenoriat. Întrebarea nu mai e dacă poți — e ce faci diferit a doua oară.',
  },
  ZERO: {
    emoji: '🌱',
    title: 'Nu ești în urmă. Ești înainte de start.',
    description: 'Răspunsurile tale arată pe cineva care s-a pregătit mai mult decât crede. Blocajul nu e unde îl cauți tu.',
  },
};
