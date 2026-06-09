import type {
  QuizState,
  QuizEvent,
  QuizPhase,
  AnswerRecord,
  ProfileAxis,
} from './types';
import { performClassification } from './classification';

export function createInitialState(sessionId?: string): QuizState {
  return {
    phase: 'INTRO',
    answers: [],
    scores: { R: 0, Re: 0, M: 0, D: 0, C: 0, S: 0 },
    profileAxis: null,
    secondaryProfile: null,
    resolvedProfile: null,
    temperature: null,
    sessionId: sessionId ?? crypto.randomUUID(),
    startedAt: Date.now(),
    pausesViewed: [],
    notesExpanded: [],
    formData: null,
    ctaClicked: false,
    shared: false,
    hasEmployees: null,
    employeeCount: null,
    currentRevenue: null,
    businessAge: null,
    entrepreneurialEducation: [],
    
    identityQuotes: [],
    monthlyCost: null,
    problemDuration: null,
    concreteProblems: [],
    triedSolutions: [],
    solutionResult: null,
    priorityReason: null,
    personalImpact: [],
    emotionalState: null,
    futureConsequences: [],
    mainGoal: null,
    revenueTarget: null,
  };
}

function replaceOrAppend(
  answers: AnswerRecord[],
  questionId: string,
  newAnswer: AnswerRecord
): AnswerRecord[] {
  const idx = answers.findIndex(a => a.questionId === questionId);
  if (idx >= 0) {
    const updated = [...answers];
    updated[idx] = newAnswer;
    return updated;
  }
  return [...answers, newAnswer];
}

function mergeScores(
  current: Record<ProfileAxis, number>,
  incoming?: Partial<Record<ProfileAxis, number>>,
  multiplier = 1
): Record<ProfileAxis, number> {
  if (!incoming) return current;
  const updated = { ...current };
  for (const [key, val] of Object.entries(incoming)) {
    updated[key as ProfileAxis] += (val as number) * multiplier;
  }
  return updated;
}

const PHASE1_FLOW: Partial<Record<QuizPhase, QuizPhase>> = {
  Q1: 'Q_INSTAGRAM',
  Q1_SOLO: 'Q_INSTAGRAM',
  Q2: 'Q4',
  Q2_SOLO: 'Q4_SOLO',
};

const PHASE2_FLOW: Partial<Record<QuizPhase, QuizPhase>> = {
  P1: 'Q_EMAIL',
  Q_EMAIL: 'P2',
  P2: 'P_BUSINESS_AGE',
  P_BUSINESS_AGE: 'P3',
  P3: 'P5',
  P5: 'Q_PHONE',
  Q_PHONE: 'PAUSE_A',
  PAUSE_A: 'L1_COST',
};

const PHASE3_FLOW: Partial<Record<QuizPhase, QuizPhase>> = {
  L1_COST: 'L_PROBLEM_DURATION',
  L_PROBLEM_DURATION: 'L1_CONCRETE',
  L1_CONCRETE: 'L2_TRIED',
  L2_TRIED: 'L2_RESULT',
  L2_RESULT: 'L2_WHY',
  L2_WHY: 'PAUSE_B',
  PAUSE_B: 'L3_IMPACT',
  L3_IMPACT: 'L3_FEELING',
  L3_FEELING: 'L3_FUTURE',
  L3_FUTURE: 'G1',
};

const PHASE4_FLOW: Partial<Record<QuizPhase, QuizPhase>> = {
  G1: 'G2',
  G2: 'TRANSITION',
};

const ALL_FLOW: Partial<Record<QuizPhase, QuizPhase>> = {
  ...PHASE1_FLOW,
  ...PHASE2_FLOW,
  ...PHASE3_FLOW,
  ...PHASE4_FLOW,
};

const BACK_MAP: Partial<Record<QuizPhase, QuizPhase>> = {
  'Q_NAME': 'INTRO',
  'Q_HAS_EMPLOYEES': 'Q_NAME',
  'Q1': 'Q_HAS_EMPLOYEES',
  'Q1_SOLO': 'Q_HAS_EMPLOYEES',
  'Q_INSTAGRAM': 'Q1',
  'Q2': 'Q_INSTAGRAM',
  'Q4': 'Q2',
  'Q2_SOLO': 'Q_INSTAGRAM',
  'Q4_SOLO': 'Q2_SOLO',
  'P1': 'Q4',
  'Q_EMAIL': 'P1',
  'P2': 'Q_EMAIL',
  'P_BUSINESS_AGE': 'P2',
  'P3': 'P_BUSINESS_AGE',
  'P5': 'P3',
  'Q_PHONE': 'P5',
  'L1_COST': 'Q_PHONE',
  'L_PROBLEM_DURATION': 'L1_COST',
  'L1_CONCRETE': 'L_PROBLEM_DURATION',
  'L2_TRIED': 'L1_CONCRETE',
  'L2_RESULT': 'L2_TRIED',
  'L2_WHY': 'L2_RESULT',
  'L3_IMPACT': 'L2_WHY',
  'L3_FEELING': 'L3_IMPACT',
  'L3_FUTURE': 'L3_FEELING',
  'G1': 'L3_FUTURE',
  'G2': 'G1',
};

function makeAnswer(questionId: string, code: string, text: string): AnswerRecord {
  return { questionId, answerCode: code, answerText: text, timestamp: Date.now() };
}

export function canGoBack(phase: QuizPhase): boolean {
  return phase in BACK_MAP;
}

export function quizReducer(state: QuizState, event: QuizEvent): QuizState {
  switch (event.type) {

    case 'START_QUIZ':
      if (state.phase !== 'INTRO') return state;
      return { ...state, phase: 'Q_NAME' };

    case 'ANSWER_Q_NAME':
      if (state.phase !== 'Q_NAME') return state;
      return {
        ...state,
        phase: 'Q_HAS_EMPLOYEES',
        answers: replaceOrAppend(state.answers, 'Q_NAME', makeAnswer('Q_NAME', 'name', event.payload.text)),
        formData: { ...(state.formData ?? { name: '', email: '' }), name: event.payload.text },
      };

    case 'ANSWER_Q_INSTAGRAM':
      if (state.phase !== 'Q_INSTAGRAM') return state;
      return {
        ...state,
        phase: state.hasEmployees === false ? 'Q2_SOLO' : 'Q2',
        answers: replaceOrAppend(state.answers, 'Q_INSTAGRAM', makeAnswer('Q_INSTAGRAM', 'instagram', event.payload.text)),
        formData: { ...(state.formData ?? { name: '', email: '' }), instagram: event.payload.text },
      };

    case 'ANSWER_Q': {
      const { code, text, scores, questionIdOverride } = event.payload;
      const qId = questionIdOverride ?? state.phase;
      const newScores = mergeScores(state.scores, scores);

      if (state.phase === 'Q4' || state.phase === 'Q4_SOLO') {
        const updatedState = {
          ...state,
          scores: newScores,
          answers: replaceOrAppend(state.answers, qId, makeAnswer(qId, code, text)),
        };
        return performClassification(updatedState);
      }

      const nextPhase = ALL_FLOW[state.phase] ?? 'COMPLETED';
      return {
        ...state,
        phase: nextPhase,
        scores: newScores,
        answers: replaceOrAppend(state.answers, qId, makeAnswer(qId, code, text)),
      };
    }

    case 'ANSWER_Q_MULTI': {
      const { codes, texts, scoresList, questionIdOverride } = event.payload;
      const qId = questionIdOverride ?? state.phase;
      let newScores = state.scores;
      if (scoresList) {
        for (const scores of scoresList) {
          newScores = mergeScores(newScores, scores);
        }
      }
      const nextPhase = ALL_FLOW[state.phase] ?? 'COMPLETED';
      const combinedText = texts.join(', ');
      return {
        ...state,
        phase: nextPhase,
        scores: newScores,
        answers: replaceOrAppend(state.answers, qId, makeAnswer(qId, codes.join(','), combinedText)),
      };
    }

    case 'ANSWER_Q_EMAIL':
      if (state.phase !== 'Q_EMAIL') return state;
      return {
        ...state,
        phase: 'P2',
        answers: replaceOrAppend(state.answers, 'Q_EMAIL', makeAnswer('Q_EMAIL', 'email', event.payload.text)),
        formData: { ...(state.formData ?? { name: '', email: '' }), email: event.payload.text },
      };

    case 'ANSWER_Q_PHONE':
      if (state.phase !== 'Q_PHONE') return state;
      return {
        ...state,
        phase: 'PAUSE_A',
        answers: replaceOrAppend(state.answers, 'Q_PHONE', makeAnswer('Q_PHONE', 'phone', event.payload.text)),
        formData: { ...(state.formData ?? { name: '', email: '' }), phone: event.payload.text },
      };

    case 'ANSWER_P_SINGLE': {
      const { field, code, text, questionId } = event.payload;

      if (state.phase === 'Q_HAS_EMPLOYEES') {
        const hasEmp = code === 'EMP_YES';
        return {
          ...state,
          phase: hasEmp ? 'Q1' : 'Q1_SOLO',
          hasEmployees: hasEmp,
          employeeCount: hasEmp ? null : 'Solo / fără angajați',
          answers: replaceOrAppend(state.answers, questionId, makeAnswer(questionId, code, text)),
        };
      }

      const nextPhase = ALL_FLOW[state.phase] ?? 'COMPLETED';
      return {
        ...state,
        phase: nextPhase,
        [field]: text,
        answers: replaceOrAppend(state.answers, questionId, makeAnswer(questionId, code, text)),
      };
    }

    case 'ANSWER_P_MULTI': {
      const { field, codes, texts, questionId } = event.payload;
      const nextPhase = ALL_FLOW[state.phase] ?? 'COMPLETED';
      return {
        ...state,
        phase: nextPhase,
        [field]: texts,
        answers: replaceOrAppend(state.answers, questionId, makeAnswer(questionId, codes.join(','), texts.join(', '))),
      };
    }

    case 'ANSWER_PAIN_SINGLE': {
      const { field, code, text, questionId } = event.payload;
      const nextPhase = ALL_FLOW[state.phase] ?? 'COMPLETED';
      return {
        ...state,
        phase: nextPhase,
        [field]: text,
        answers: replaceOrAppend(state.answers, questionId, makeAnswer(questionId, code, text)),
      };
    }

    case 'ANSWER_PAIN_MULTI': {
      const { field, codes, texts, questionId } = event.payload;
      const nextPhase = ALL_FLOW[state.phase] ?? 'COMPLETED';
      return {
        ...state,
        phase: nextPhase,
        [field]: texts,
        answers: replaceOrAppend(state.answers, questionId, makeAnswer(questionId, codes.join(','), texts.join(', '))),
      };
    }

    case 'ANSWER_GOAL': {
      const { field, code, text, questionId } = event.payload;
      const nextPhase = ALL_FLOW[state.phase] ?? 'TRANSITION';

      let temperature = state.temperature;
      if (questionId === 'G1') {
        if (code === 'G1A' || code === 'G1E') temperature = 'HOT';
        else if (code === 'G1B' || code === 'G1C') temperature = 'WARM';
        else temperature = 'COLD';
      }

      return {
        ...state,
        phase: nextPhase,
        temperature,
        [field]: text,
        answers: replaceOrAppend(state.answers, questionId, makeAnswer(questionId, code, text)),
      };
    }

    case 'ANSWER_GOAL_MULTI': {
      const { field, codes, texts, questionId } = event.payload;
      const nextPhase = ALL_FLOW[state.phase] ?? 'TRANSITION';

      let temperature = state.temperature;
      if (questionId === 'G1') {
        const hasHot = codes.some(c => c === 'G1A' || c === 'G1E');
        const hasWarm = codes.some(c => c === 'G1B' || c === 'G1C');
        if (hasHot) temperature = 'HOT';
        else if (hasWarm) temperature = 'WARM';
        else temperature = 'COLD';
      }

      return {
        ...state,
        phase: nextPhase,
        temperature,
        [field]: texts.join(', '),
        answers: replaceOrAppend(state.answers, questionId, makeAnswer(questionId, codes.join(','), texts.join(', '))),
      };
    }

    case 'CONTINUE_PAUSE': {
      const pauseMap: Partial<Record<QuizPhase, QuizPhase>> = {
        PAUSE_A: 'L1_COST',
        PAUSE_B: 'L3_IMPACT',
        PAUSE_C: 'TRANSITION',
      };
      const pauseId = state.phase === 'PAUSE_A' ? 'A' : state.phase === 'PAUSE_B' ? 'B' : 'C';
      return {
        ...state,
        phase: pauseMap[state.phase] ?? state.phase,
        pausesViewed: state.pausesViewed.includes(pauseId)
          ? state.pausesViewed
          : [...state.pausesViewed, pauseId],
      };
    }

    case 'CONTINUE_MID_TRANSITION':
      return { ...state, phase: 'P1' };

    case 'CONTINUE_TRANSITION':
      return { ...state, phase: 'RESULT' };

    case 'CTA_CLICKED':
      return { ...state, ctaClicked: true, phase: 'COMPLETED' };

    case 'SHARED':
      return { ...state, shared: true };

    case 'GO_BACK': {
      let prevPhase: QuizPhase | undefined = BACK_MAP[state.phase];
      if (state.phase === 'Q_INSTAGRAM' && state.hasEmployees === false) {
        prevPhase = 'Q1_SOLO';
      }
      if (state.phase === 'Q_EMAIL' && state.hasEmployees === false) {
        prevPhase = 'Q4_SOLO';
      }
      if (!prevPhase) return state;
      return { ...state, phase: prevPhase };
    }

    case 'EXPAND_NOTE':
      return {
        ...state,
        notesExpanded: state.notesExpanded.includes(event.payload)
          ? state.notesExpanded
          : [...state.notesExpanded, event.payload],
      };

    case 'RESTORE_SESSION':
      return event.payload;

    default:
      return state;
  }
}
