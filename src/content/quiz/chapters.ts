import type { QuizPhase, Branch } from '@/lib/quiz/types';

// ============================================================
// Capitole — quizul devine o călătorie în 4 acte, nu un formular.
// Bara de progres = 4 segmente; numele capitolului apare în header.
// Pauzele/reveal-ul sunt incluse, deci fiecare fază are un loc.
// ============================================================

export interface Chapter {
  name: string;
  phases: QuizPhase[];
}

const CHAPTERS_A: Chapter[] = [
  {
    name: 'Unde te blochezi',
    phases: ['Q_HAS_EMPLOYEES', 'Q1', 'Q1_SOLO', 'Q_INSTAGRAM', 'Q2', 'Q2_SOLO', 'Q4', 'Q4_SOLO', 'REVEAL_PROFILE'],
  },
  {
    name: 'Radiografia afacerii',
    phases: ['P1', 'Q_EMAIL', 'P2', 'P_BUSINESS_AGE', 'P3', 'P5', 'Q_PHONE'],
  },
  {
    name: 'Costul real',
    phases: ['PAUSE_A', 'L1_COST', 'L_PROBLEM_DURATION', 'L1_CONCRETE', 'L2_TRIED', 'L2_RESULT', 'L2_WHY', 'PAUSE_B', 'L3_IMPACT', 'L3_FEELING', 'L3_FUTURE'],
  },
  {
    name: 'Direcția ta',
    phases: ['G1', 'G2'],
  },
];

const CHAPTERS_B: Chapter[] = [
  {
    name: 'Punctul de pornire',
    phases: ['B_SITUATION', 'B_BLOCKER', 'B_DREAM', 'REVEAL_PROFILE'],
  },
  {
    name: 'Profilul tău',
    phases: ['B_INVEST', 'B_READINESS', 'Q_INSTAGRAM', 'Q_EMAIL', 'Q_PHONE'],
  },
  {
    name: 'Costul așteptării',
    phases: ['PAUSE_B1', 'B_DELAY', 'B_COST', 'B_FEELING', 'B_FUTURE'],
  },
  {
    name: 'Pasul următor',
    phases: ['PAUSE_B2', 'B_GOAL'],
  },
];

export interface ChapterPosition {
  index: number;        // 0-based; -1 = înainte de capitole (nume/furcă)
  name: string;
  fraction: number;     // 0..1 progres ÎN capitolul curent
  total: number;        // numărul de capitole
}

export function getChapterPosition(phase: QuizPhase, branch: Branch | null): ChapterPosition {
  const chapters = branch === 'B' ? CHAPTERS_B : CHAPTERS_A;
  for (let i = 0; i < chapters.length; i++) {
    const idx = chapters[i].phases.indexOf(phase);
    if (idx >= 0) {
      return { index: i, name: chapters[i].name, fraction: (idx + 1) / chapters[i].phases.length, total: chapters.length };
    }
  }
  // Q_NAME / Q_STAGE / ecrane terminale
  const terminal = phase === 'TRANSITION' || phase === 'RESULT' || phase === 'COMPLETED';
  return { index: terminal ? chapters.length : -1, name: '', fraction: 0, total: chapters.length };
}

// Linia afișată scurt în header când un capitol se încheie.
export function milestoneLine(chapterName: string): string {
  return `„${chapterName}" e gata. Diagnosticul tău prinde contur.`;
}
