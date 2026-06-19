import type { QuizState, ProfileAxis, BProfileAxis } from './types';

// ============================================================
// Scoruri gamificate pentru ecranul de rezultat.
// A → „Scor de Libertate" (cât de mult depinde afacerea de tine) + radar pe 6 axe.
// B → „Pregătire de start" + poziție pe traseul începătorului.
// Toate derivate din răspunsurile reale (codurile din state.answers).
// ============================================================

function code(state: QuizState, questionId: string): string | null {
  const a = state.answers.find(x => x.questionId === questionId);
  return a ? a.answerCode : null;
}
function codes(state: QuizState, questionId: string): string[] {
  const c = code(state, questionId);
  return c ? c.split(',') : [];
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

// ── Etichete axe (ramura A) ──
export const AXIS_LABEL: Record<ProfileAxis, string> = {
  R: 'Recrutare',
  Re: 'Retenție',
  M: 'Motivație',
  D: 'Delegare',
  C: 'Control',
  S: 'Structură',
};

export interface ScoreResult {
  value: number;          // 0–100
  title: string;          // titlul scorului (ex. „Scor de Libertate")
  band: string;           // banda calitativă (ex. „Afacere-capcană")
  caption: string;        // o frază care explică scorul
  kind: 'freedom' | 'readiness';
}

export interface AxisDatum {
  axis: ProfileAxis;
  label: string;
  value: number;          // 0–100 normalizat
  isPrimary: boolean;
}

// ── RAMURA A — Scor de Libertate (mare = afacerea merge fără tine) ──
export function computeFreedomScore(state: QuizState): ScoreResult {
  let s = 100;

  const vac = code(state, 'Q4') ?? code(state, 'Q4_SOLO');
  if (vac && ['Q4A', 'Q4F', 'Q4SA', 'Q4SC'].includes(vac)) s -= 28;
  else if (vac && ['Q4B', 'Q4C', 'Q4SB', 'Q4SD'].includes(vac)) s -= 18;
  else if (vac === 'Q4D') s -= 16;
  else if (vac && ['Q4E', 'Q4SE'].includes(vac)) s -= 8;

  const feel = code(state, 'L3_FEELING');
  if (feel === 'L3FD') s -= 20;
  else if (feel === 'L3FC') s -= 16;
  else if (feel === 'L3FB') s -= 7;

  const fut = codes(state, 'L3_FUTURE');
  if (fut.includes('L3XC')) s -= 10; // burnout
  if (fut.includes('L3XE')) s -= 8;  // vrea să vândă firma
  if (fut.includes('L3XB')) s -= 5;  // pierde oameni

  const cost = code(state, 'L1_COST');
  if (cost === 'L1CD') s -= 10;
  else if (cost === 'L1CC') s -= 7;
  else if (cost === 'L1CB') s -= 4;
  else if (cost === 'L1CA') s -= 1;

  const res = code(state, 'L2_RESULT');
  if (res === 'L2RA') s -= 8;
  else if (res === 'L2RD') s -= 6;
  else if (res === 'L2RB') s -= 4;
  else if (res === 'L2RC') s -= 2;

  const dur = code(state, 'L_PROBLEM_DURATION');
  if (dur === 'PD_4') s -= 6;
  else if (dur === 'PD_3') s -= 4;

  const value = clamp(Math.round(s), 8, 92);

  let band: string, caption: string;
  if (value <= 35) {
    band = 'Afacere-capcană';
    caption = 'Acum afacerea depinde aproape complet de prezența ta. Vestea bună: exact asta se poate inversa cu un sistem.';
  } else if (value <= 55) {
    band = 'Fragilă';
    caption = 'Merge — dar pe efortul tău. Câteva sisteme corecte și nu mai ești tu gâtul de sticlă.';
  } else if (value <= 75) {
    band = 'În tranziție';
    caption = 'Ai pus deja câteva piese. Mai e drum până afacerea rulează cu adevărat fără tine.';
  } else {
    band = 'Aproape liberă';
    caption = 'Ești pe drumul bun. Optimizările fine fac diferența de aici încolo.';
  }

  return { value, title: 'Scorul tău de Libertate', band, caption, kind: 'freedom' };
}

// ── RAMURA A — date radar pe 6 axe (normalizate la max) ──
export function computeAxes(state: QuizState): AxisDatum[] {
  const order: ProfileAxis[] = ['R', 'Re', 'M', 'D', 'C', 'S'];
  const max = Math.max(1, ...order.map(a => state.scores[a]));
  return order.map(a => ({
    axis: a,
    label: AXIS_LABEL[a],
    value: Math.round((state.scores[a] / max) * 100),
    isPrimary: a === state.profileAxis,
  }));
}

// ── RAMURA B — Scor de Pregătire (mare = gata de primul pas) ──
export function computeReadinessScore(state: QuizState): ScoreResult {
  let s = 0;

  const ready = code(state, 'B_READINESS');
  s += ready === 'BR_A' ? 40 : ready === 'BR_B' ? 28 : ready === 'BR_C' ? 12 : 5;

  const feel = code(state, 'B_FEELING');
  s += feel === 'BF_D' ? 25 : feel === 'BF_A' ? 15 : feel === 'BF_C' ? 8 : 6;

  const goal = code(state, 'B_GOAL');
  s += goal === 'BG_A' ? 25 : goal === 'BG_B' ? 16 : goal === 'BG_C' ? 8 : 3;

  const invest = code(state, 'B_INVEST');
  s += invest === 'BI_D' ? 10 : invest === 'BI_C' ? 7 : invest === 'BI_B' ? 4 : 2;

  const value = clamp(Math.round(s), 10, 95);

  let band: string, caption: string;
  if (value <= 40) {
    band = 'Explorator';
    caption = 'Ești la început de tot — și e perfect normal. Primul pas e claritatea, nu curajul.';
  } else if (value <= 70) {
    band = 'Aproape pregătit';
    caption = 'Ai energia și dorința. Îți lipsește doar harta pașilor, în ordinea corectă.';
  } else {
    band = 'Gata de start';
    caption = 'Ești copt pentru acțiune. Acum contează să pornești corect, nu doar repede.';
  }

  return { value, title: 'Pregătirea ta de start', band, caption, kind: 'readiness' };
}

// ── Traseul începătorului (ramura B) — unde ești pe drum ──
export const B_JOURNEY = ['Idee & nișă', 'Validare', 'Primii clienți', 'Primul angajat'] as const;

export function computeJourneyStage(state: QuizState): number {
  // 0-index în B_JOURNEY, pe baza situației + profilului
  const sit = code(state, 'B_SITUATION');
  if (sit === 'BS_D') return 1;            // are un mic început → validare
  if (state.bProfile === 'ARS') return 1;  // a mai pornit → repornește din validare
  if (state.bProfile === 'ANGAJAT') return 1;
  return 0;                                 // ZERO → de la idee/nișă
}

export function getScore(state: QuizState): ScoreResult {
  return state.branch === 'B' ? computeReadinessScore(state) : computeFreedomScore(state);
}
