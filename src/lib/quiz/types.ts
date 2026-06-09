// ============================================
// Victor Morar Quiz — Core Type Definitions (v2)
// ============================================

export type ProfileAxis = 'R' | 'Re' | 'M' | 'D' | 'C' | 'S';
export type Temperature = 'HOT' | 'WARM' | 'COLD';

export type QuizPhase =
  | 'INTRO'
  // Intro + Date initiale
  | 'Q_NAME'
  // Faza 1 — Identificare tipologie (scoring)
  | 'Q_HAS_EMPLOYEES'    // Gate: ai angajati? (prima intrebare de business)
  | 'Q1'                 // Frustrare echipa (cu angajati)
  | 'Q1_SOLO'            // Frustrare business (fara angajati)
  | 'Q_INSTAGRAM'
  | 'Q2'                 // Zi tipica (cu angajati)
  | 'Q2_SOLO'            // Zi tipica (fara angajati)
  | 'Q4'                 // Vacation test (cu angajati) — tie-breaker x2
  | 'Q4_SOLO'            // Vacation test (fara angajati) — tie-breaker x2
  // Faza 2 — Profilare individuala
  | 'P1'                 // Cati angajati ai? (skip daca nu are angajati)
  | 'Q_EMAIL'
  | 'P2'                 // Cifra de afaceri lunara actuala
  | 'P_BUSINESS_AGE'     // De cat timp dezvolti afacerea curenta?
  | 'P3'                 // Educatie antreprenoriala (multi-select)
  | 'P5'                 // Afirmatie cu care se identifica (multi-select)
  | 'Q_PHONE'
  // Faza 3 — Pain Funnel
  | 'L1_COST'            // Cat te costa pe luna?
  | 'L_PROBLEM_DURATION' // De cat timp ai problema?
  | 'L1_CONCRETE'        // Cum arata concret problema saptamana asta? (adaptat pe tipologie)
  | 'L2_TRIED'     // Ce ai incercat? (adaptat pe tipologie)
  | 'L2_RESULT'    // Cat de mult a functionat?
  | 'L2_WHY'       // De ce a devenit prioritatea ta #1?
  | 'L3_IMPACT'    // Ce impact are asupra ta personal? (multi-select)
  | 'L3_FEELING'   // Cum te simti fata de situatie?
  | 'L3_FUTURE'    // Daca nu schimbi nimic in 6 luni? (multi-select)
  // Faza 4 — Scopul real
  | 'G1'           // Obiectivul principal 12 luni
  | 'G2'           // Cifra de afaceri tinta
  // Tranzitie + Rezultat
  | 'PAUSE_A'
  | 'PAUSE_B'
  | 'PAUSE_C'
  | 'MID_TRANSITION'
  | 'TRANSITION'
  | 'RESULT'
  | 'COMPLETED';

export interface AnswerRecord {
  questionId: string;
  answerCode: string;
  answerText: string;
  timestamp: number;
}

export interface QuizState {
  phase: QuizPhase;
  answers: AnswerRecord[];
  scores: Record<ProfileAxis, number>;
  profileAxis: ProfileAxis | null;        // Primary (setata dupa Q4)
  secondaryProfile: ProfileAxis | null;   // Secondary
  resolvedProfile: ProfileAxis | null;
  temperature: Temperature | null;
  sessionId: string;
  startedAt: number;
  pausesViewed: ('A' | 'B' | 'C')[];
  notesExpanded: string[];
  formData: QuizFormData | null;
  ctaClicked: boolean;
  shared: boolean;

  // === Faza 2: Date profil ===
  hasEmployees: boolean | null;           // Q_HAS_EMPLOYEES — gate
  employeeCount: string | null;           // P1 — 1-4 / 5-15 / 16-30 / 30+ (sau 'Solo')
  currentRevenue: string | null;          // P2 — cifra actuala
  businessAge: string | null;             // P_BUSINESS_AGE — de cat timp afacerea
  entrepreneurialEducation: string[];     // P3 — multi-select
  identityQuotes: string[];               // P5 — afirmatii alese (multi-select)

  // === Faza 3: Pain Funnel ===
  monthlyCost: string | null;             // L1_COST
  problemDuration: string | null;         // L_PROBLEM_DURATION
  concreteProblems: string[];             // L1_CONCRETE — multi
  triedSolutions: string[];              // L2_TRIED — multi (adaptat pe tipologie)
  solutionResult: string | null;          // L2_RESULT
  priorityReason: string | null;          // L2_WHY
  personalImpact: string[];               // L3_IMPACT — multi
  emotionalState: string | null;          // L3_FEELING
  futureConsequences: string[];           // L3_FUTURE — multi

  // === Faza 4: Scop ===
  mainGoal: string | null;                // G1
  revenueTarget: string | null;           // G2
}

export interface QuizFormData {
  name: string;
  email: string;
  instagram?: string;
  phone?: string;
  occupation?: string;
}

export type QuizEvent =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_Q_NAME'; payload: { text: string } }
  | { type: 'ANSWER_Q_INSTAGRAM'; payload: { text: string } }
  // Faza 1 — scoring questions
  | { type: 'ANSWER_Q'; payload: { code: string; text: string; scores?: Partial<Record<ProfileAxis, number>>; questionIdOverride?: string } }
  | { type: 'ANSWER_Q_MULTI'; payload: { codes: string[]; texts: string[]; scoresList?: Partial<Record<ProfileAxis, number>>[]; questionIdOverride?: string } }
  // Faza 2 — profil
  | { type: 'ANSWER_P_SINGLE'; payload: { field: keyof QuizState; code: string; text: string; questionId: string } }
  | { type: 'ANSWER_P_MULTI'; payload: { field: keyof QuizState; codes: string[]; texts: string[]; questionId: string } }
  | { type: 'ANSWER_Q_EMAIL'; payload: { text: string } }
  | { type: 'ANSWER_Q_PHONE'; payload: { text: string } }
  // Faza 3 — pain funnel
  | { type: 'ANSWER_PAIN_SINGLE'; payload: { field: keyof QuizState; code: string; text: string; questionId: string } }
  | { type: 'ANSWER_PAIN_MULTI'; payload: { field: keyof QuizState; codes: string[]; texts: string[]; questionId: string } }
  // Faza 4 — scop
  | { type: 'ANSWER_GOAL'; payload: { field: keyof QuizState; code: string; text: string; questionId: string } }
  | { type: 'ANSWER_GOAL_MULTI'; payload: { field: keyof QuizState; codes: string[]; texts: string[]; questionId: string } }
  // Flow control
  | { type: 'MICRO_VALIDATION_DONE' }
  | { type: 'CONTINUE_PAUSE' }
  | { type: 'CONTINUE_MID_TRANSITION' }
  | { type: 'CONTINUE_TRANSITION' }
  | { type: 'CTA_CLICKED' }
  | { type: 'SHARED' }
  | { type: 'GO_BACK' }
  | { type: 'RESTORE_SESSION'; payload: QuizState }
  | { type: 'EXPAND_NOTE'; payload: string };

export interface AnswerOption {
  code: string;
  text: string;
  emoji?: string;
  note?: ExplanatoryNote;
  microValidation?: string;
  isOther?: boolean;
  scores?: Partial<Record<ProfileAxis, number>>;
}

export interface ExplanatoryNote {
  text: string;
}

export interface Question {
  id: string;
  phase: string;
  text: string;
  subtitle?: string;
  noteAbove?: string;
  options: AnswerOption[];
  multiSelect?: boolean;
  isTieBreaker?: boolean;
  quote?: { text: string; author: string };
  isDiscriminatory?: boolean;
}

export interface ProfileRevealContent {
  emoji: string;
  title: string;
  description: string;
}

export interface SocialProofContent {
  text: string;
  buttonText: string;
  image?: string;
}

export interface ResultSection {
  icon: string;
  title: string;
  body: string;
}

export interface ResultTemplate {
  profileLabel: string;
  levelLabel: string;
  headline: string;
  sections: ResultSection[];
  socialProof: string;
  cta: Record<Temperature, {
    text: string;
    subtext: string;
    action: 'waitlist' | 'email_result' | 'lesson_beginner' | 'lesson_expert';
    url?: string;
  }>;
}
