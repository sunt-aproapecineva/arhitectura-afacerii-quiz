// ============================================
// Victor Morar Quiz — Core Type Definitions (v2)
// ============================================

export type ProfileAxis = 'R' | 'Re' | 'M' | 'D' | 'C' | 'S';
// Ramura B — începători (cei care vor să deschidă o afacere).
// 3 persona din strategie: Angajatul-antreprenor / Întemeietorul ars / Începătorul de la zero.
export type BProfileAxis = 'ANGAJAT' | 'ARS' | 'ZERO';
export type Branch = 'A' | 'B';
export type Temperature = 'HOT' | 'WARM' | 'COLD';

export type QuizPhase =
  | 'INTRO'
  // Intro + Date initiale
  | 'Q_NAME'
  | 'Q_STAGE'            // FURCĂ A/B: ai o afacere activă SAU ești la început?
  // === RAMURA B — Începători ===
  | 'B_SITUATION'        // Unde ești pe drumul spre prima afacere? (scoring B)
  | 'B_BLOCKER'          // Ce te oprește cel mai mult? (scoring B, discriminator)
  | 'B_DREAM'            // Cum ar arăta reușita în 12 luni? (scoring B, tie-breaker)
  | 'B_INVEST'           // Ai investit în educația ta de business? (profil)
  | 'B_READINESS'        // Cât de aproape ești de primul pas serios? (profil)
  | 'B_DELAY'            // De cât timp tot amâni? (pain — costul nemișcării)
  | 'B_COST'             // Ce te-a costat deja că n-ai pornit? (pain, multi)
  | 'B_FEELING'          // Cum te simți că încă n-ai început? (pain)
  | 'B_FUTURE'           // Dacă peste 1 an ești tot aici? (pain, multi)
  | 'B_GOAL'             // Ce vrei de la pasul următor? (setează temperatura)
  | 'PAUSE_B1'           // Social proof B (după contact)
  | 'PAUSE_B2'           // Social proof B (înainte de scop)
  | 'REVEAL_PROFILE'     // Interstițiu: profilul începe să se contureze (după clasificare, ambele ramuri)
  // === RAMURA A — Afacere activă ===
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

// Telemetrie: un eveniment per schimbare de fază — reconstruiește funnel-ul și timpii per pas.
export interface TimelineEvent {
  phase: QuizPhase;
  at: number;
}

export interface QuizState {
  phase: QuizPhase;
  answers: AnswerRecord[];
  branch: Branch | null;                   // Q_STAGE — 'A' afacere activă / 'B' începător
  scores: Record<ProfileAxis, number>;
  profileAxis: ProfileAxis | null;        // Primary (setata dupa Q4) — ramura A
  secondaryProfile: ProfileAxis | null;   // Secondary — ramura A
  resolvedProfile: ProfileAxis | null;
  // === Ramura B — scoring + profil începător ===
  bScores: Record<BProfileAxis, number>;
  bProfile: BProfileAxis | null;          // setat după B_DREAM
  bSituation: string | null;              // B_SITUATION (text)
  bBlocker: string | null;                // B_BLOCKER (text)
  bInvest: string | null;                 // B_INVEST
  bReadiness: string | null;              // B_READINESS
  temperature: Temperature | null;
  sessionId: string;
  startedAt: number;
  timeline: TimelineEvent[];
  pausesViewed: ('A' | 'B' | 'C' | 'B1' | 'B2')[];
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
  // Furcă A/B
  | { type: 'ANSWER_Q_STAGE'; payload: { branch: Branch; code: string; text: string } }
  // Ramura B — scoring profil începător (ANGAJAT/ARS/ZERO)
  | { type: 'ANSWER_B'; payload: { field?: keyof QuizState; code: string; text: string; bScores?: Partial<Record<BProfileAxis, number>>; questionId: string } }
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
  | { type: 'CONTINUE_REVEAL' }
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
  scores?: Partial<Record<ProfileAxis, number>>;       // ramura A
  bScores?: Partial<Record<BProfileAxis, number>>;     // ramura B
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

// Acțiunea CTA de pe ecranul de rezultat — determină unde merge lead-ul.
export type CtaAction =
  | 'waitlist'
  | 'email_result'
  | 'lesson_beginner'
  | 'lesson_expert'
  | 'book_call'      // HOT — programează apel (calendar)
  | 'whatsapp'       // DM pe WhatsApp cu mesaj precompletat
  | 'mini_curs'      // ramura B — tripwire mini-curs 19/49€
  | 'start';         // ramura B — produsul START

export interface CtaConfig {
  text: string;
  subtext: string;
  action: CtaAction;
  url?: string;
}

export interface ResultTemplate {
  profileLabel: string;
  levelLabel: string;
  headline: string;
  sections: ResultSection[];
  socialProof: string;
  cta: Record<Temperature, CtaConfig>;
}
