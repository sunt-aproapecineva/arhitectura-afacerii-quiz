import type { Question } from '@/lib/quiz/types';

// ============================================================
// RAMURA B — ÎNCEPĂTORI (cei care vor să deschidă o afacere)
// Produsul țintă: mini-curs (tripwire) → START
// 3 persona (strategie): ANGAJAT (angajatul-antreprenor) ·
// ARS (întemeietorul ars) · ZERO (începătorul de la zero)
// ============================================================

// ── FURCĂ A/B (după Q_NAME) ──────────────────────────────────
export const Q_STAGE: Question = {
  id: 'Q_STAGE',
  phase: 'Q_STAGE',
  text: '[PRENUME], care variantă te descrie cel mai bine acum?',
  noteAbove: 'Înainte de toate',
  multiSelect: false,
  options: [
    {
      code: 'STAGE_A',
      text: 'Am deja o afacere care funcționează — cu clienți și venituri',
    },
    {
      code: 'STAGE_B',
      text: 'Sunt la început — vreau să-mi deschid afacerea sau s-o pornesc cu adevărat',
    },
  ],
};

// ── B1 · SITUAȚIE (scoring) ──────────────────────────────────
export const B_SITUATION: Question = {
  id: 'B_SITUATION',
  phase: 'B_SITUATION',
  text: '[PRENUME], unde te afli acum pe drumul spre afacerea ta?',
  multiSelect: false,
  quote: {
    text: 'Și eu am pornit de la zero. Diferența dintre cei care reușesc și cei care rămân pe loc nu e talentul sau norocul — e că unii au început în ordinea corectă, iar ceilalți încă se pregătesc.',
    author: 'Victor Morar',
  },
  options: [
    {
      code: 'BS_A',
      text: 'Am un job sau o sursă de venit și vreau să-mi construiesc ceva al meu, în paralel',
      bScores: { ANGAJAT: 3 },
    },
    {
      code: 'BS_B',
      text: 'Am mai pornit o afacere odată, dar nu a mers / am închis-o',
      bScores: { ARS: 3 },
    },
    {
      code: 'BS_C',
      text: 'N-am pornit încă nimic — vreau, dar nu știu de unde să încep',
      bScores: { ZERO: 3 },
    },
    {
      code: 'BS_D',
      text: 'Am o idee sau un mic început, dar nu merge încă cum trebuie',
      bScores: { ZERO: 2, ANGAJAT: 1 },
    },
  ],
};

// ── B2 · BLOCAJ (scoring, discriminator) ─────────────────────
export const B_BLOCKER: Question = {
  id: 'B_BLOCKER',
  phase: 'B_BLOCKER',
  text: 'Ce te oprește cel mai mult acum?',
  multiSelect: false,
  isDiscriminatory: true,
  quote: {
    text: 'Majoritatea cred că le lipsește curajul. De fapt le lipsește harta. Cu pașii corecți în față, frica scade singură — pentru că nu mai sari în gol.',
    author: 'Victor Morar',
  },
  options: [
    {
      code: 'BB_A',
      text: 'Nu știu ce afacere sau ce nișă mi se potrivește',
      bScores: { ZERO: 3 },
    },
    {
      code: 'BB_B',
      text: 'Nu știu ordinea pașilor — ce fac întâi, ce vine după',
      bScores: { ZERO: 2, ARS: 1 },
    },
    {
      code: 'BB_C',
      text: 'Nu am curaj să renunț la siguranța pe care o am acum',
      bScores: { ANGAJAT: 3 },
    },
    {
      code: 'BB_D',
      text: 'Am mai investit timp și bani și m-am ars — mi-e frică să se repete',
      bScores: { ARS: 3 },
    },
  ],
};

// ── B3 · REUȘITA (scoring, tie-breaker) ──────────────────────
export const B_DREAM: Question = {
  id: 'B_DREAM',
  phase: 'B_DREAM',
  text: '[PRENUME], cum ar arăta o reușită reală pentru tine în următorul an?',
  multiSelect: false,
  isTieBreaker: true,
  options: [
    {
      code: 'BD_A',
      text: 'Primii clienți și primele vânzări reale — dovada că funcționează',
      bScores: { ZERO: 3 },
    },
    {
      code: 'BD_B',
      text: 'Să pot renunța la job și să trăiesc din afacerea mea',
      bScores: { ANGAJAT: 3 },
    },
    {
      code: 'BD_C',
      text: 'Să dovedesc — mai ales mie — că pot, după ce am căzut o dată',
      bScores: { ARS: 3 },
    },
    {
      code: 'BD_D',
      text: 'O afacere construită corect, ca la carte, care chiar poate crește',
      bScores: { ZERO: 1, ANGAJAT: 1, ARS: 1 },
    },
  ],
};

// ── B · PROFIL (după email) ──────────────────────────────────
export const B_INVEST: Question = {
  id: 'B_INVEST',
  phase: 'B_INVEST',
  text: 'Ai investit până acum în educația ta de business?',
  multiSelect: false,
  options: [
    { code: 'BI_A', text: 'Nu — încă nu am investit în cursuri sau mentorat' },
    { code: 'BI_B', text: 'Doar conținut gratuit — cărți, podcasturi, YouTube' },
    { code: 'BI_C', text: 'Am fost la cursuri sau traininguri, dar fără un rezultat concret' },
    { code: 'BI_D', text: 'Am lucrat cu un mentor / am investit serios în mine' },
  ],
};

export const B_READINESS: Question = {
  id: 'B_READINESS',
  phase: 'B_READINESS',
  text: 'Cât de aproape ești de a face primul pas serios?',
  multiSelect: false,
  options: [
    { code: 'BR_A', text: 'Sunt gata acum — îmi trebuie doar direcția corectă' },
    { code: 'BR_B', text: 'În următoarele luni, dacă am un plan clar' },
    { code: 'BR_C', text: 'Mă tot pregătesc de ceva timp, dar amân' },
    { code: 'BR_D', text: 'Mai degrabă explorez — încă nu m-am decis' },
  ],
};

// ── B · PAIN FUNNEL (costul nemișcării) ──────────────────────
export const B_DELAY: Question = {
  id: 'B_DELAY',
  phase: 'B_DELAY',
  text: 'De cât timp tot spui că „o să încep"?',
  multiSelect: false,
  options: [
    { code: 'BDL_A', text: 'De câteva luni' },
    { code: 'BDL_B', text: 'De aproape un an' },
    { code: 'BDL_C', text: 'De câțiva ani — tot amân' },
    { code: 'BDL_D', text: 'Dintotdeauna mi-am dorit, dar n-am pornit niciodată' },
  ],
};

export const B_COST: Question = {
  id: 'B_COST',
  phase: 'B_COST',
  text: '[PRENUME], ce te-a costat deja faptul că n-ai pornit?',
  subtitle: 'Alege tot ce simți că e adevărat.',
  multiSelect: true,
  quote: {
    text: 'Nimeni nu vorbește despre asta: cel mai scump lucru nu e o greșeală la start. E anul în care n-ai făcut nimic, pentru că ți-a fost frică să greșești.',
    author: 'Victor Morar',
  },
  options: [
    { code: 'BC_A', text: 'Timp — sunt cam în același loc ca acum 1–2 ani' },
    { code: 'BC_B', text: 'Bani — venit pe care l-aș fi putut avea deja' },
    { code: 'BC_C', text: 'Încredere — încep să cred că poate nu e pentru mine' },
    { code: 'BC_D', text: 'Oportunități — am văzut idei de-ale mele făcute de alții' },
    { code: 'BC_E', text: 'Liniște — gândul ăsta îmi stă mereu pe undeva în minte' },
  ],
};

export const B_FEELING: Question = {
  id: 'B_FEELING',
  phase: 'B_FEELING',
  text: 'Cum te simți când te gândești că încă n-ai început?',
  multiSelect: false,
  options: [
    { code: 'BF_A', text: 'Frustrat — știu că pot mai mult' },
    { code: 'BF_B', text: 'Speriat — și dacă încerc și nu iese?' },
    { code: 'BF_C', text: 'Blocat — vreau, dar nu știu cum' },
    { code: 'BF_D', text: 'Hotărât — gata, de data asta chiar o fac' },
  ],
};

export const B_FUTURE: Question = {
  id: 'B_FUTURE',
  phase: 'B_FUTURE',
  text: '[PRENUME], dacă peste un an ești exact unde ești acum, ce se întâmplă?',
  subtitle: 'Alege tot ce simți că e adevărat.',
  multiSelect: true,
  options: [
    { code: 'BX_A', text: 'Voi regreta că am mai pierdut un an din viața mea' },
    { code: 'BX_B', text: 'Voi rămâne dependent de job sau de alții' },
    { code: 'BX_C', text: 'Voi privi cum alții reușesc cu idei ca ale mele' },
    { code: 'BX_D', text: 'Voi începe să cred că momentul meu a trecut' },
  ],
};

// ── B · SCOP (setează temperatura) ───────────────────────────
export const B_GOAL: Question = {
  id: 'B_GOAL',
  phase: 'B_GOAL',
  text: 'Ce vrei cel mai mult de la pasul următor?',
  multiSelect: false,
  options: [
    { code: 'BG_A', text: 'Să încep ACUM, corect, cu un plan clar în față' },
    { code: 'BG_B', text: 'Să capăt claritate pe ce afacere și cum o construiesc' },
    { code: 'BG_C', text: 'Să-mi dau seama dacă antreprenoriatul chiar e pentru mine' },
    { code: 'BG_D', text: 'Deocamdată mă informez, nu mă grăbesc' },
  ],
};
