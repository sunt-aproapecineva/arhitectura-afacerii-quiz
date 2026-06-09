import { useReducer, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { quizReducer, createInitialState, canGoBack } from '@/lib/quiz/machine';
import { getResultTemplate } from '@/lib/quiz/results';
import { submitQuiz } from '@/lib/quiz/submission';
import { PROFILE_REVEALS } from '@/content/quiz/profile-reveals';
import { INTRO_CONTENT } from '@/content/quiz/intro';
import { PAUSE_A_CONTENT, PAUSE_B_CONTENT } from '@/content/quiz/gifts';
import {
  Q_HAS_EMPLOYEES, Q1, Q1_SOLO, Q2, Q2_SOLO, Q4, Q4_SOLO,
  P1, P2, P_BUSINESS_AGE, P3, P5,
  L1_COST, L1_CONCRETE_BASE, L1_CONCRETE_OPTIONS,
  L2_TRIED_BASE, L2_TRIED_OPTIONS, L2_RESULT, L2_WHY,
  L_PROBLEM_DURATION_BASE,
  L3_IMPACT, L3_FEELING, L3_FUTURE,
  G1, G2,
} from '@/content/quiz/universal';
import type { Question, AnswerOption, QuizPhase, QuizState } from '@/lib/quiz/types';
import { IntroScreen } from './IntroScreen';
import { QuestionCard } from './QuestionCard';
import { TextInputCard } from './TextInputCard';
import { SocialProofPause } from './SocialProofPause';
import { MidTransitionScreen } from './MidTransitionScreen';
import { FinalTransitionScreen } from './FinalTransitionScreen';
import { MicroValidation } from './MicroValidation';

// ── Progress calculation ──
// Map each phase to a progress % (0-100). Solo variants share the same slot.
const PHASE_PROGRESS: Partial<Record<QuizPhase, number>> = {
  INTRO: 0,
  Q_NAME: 4,
  Q_HAS_EMPLOYEES: 8,
  Q1: 12, Q1_SOLO: 12,
  Q_INSTAGRAM: 16,
  Q2: 20, Q2_SOLO: 20,
  Q4: 24, Q4_SOLO: 24,
  P1: 28,
  Q_EMAIL: 32,
  P2: 36,
  P_BUSINESS_AGE: 40,
  P3: 44,
  P5: 48,
  Q_PHONE: 52,
  PAUSE_A: 56,
  L1_COST: 60,
  L_PROBLEM_DURATION: 64,
  L1_CONCRETE: 68,
  L2_TRIED: 72,
  L2_RESULT: 76,
  L2_WHY: 80,
  PAUSE_B: 84,
  L3_IMPACT: 88,
  L3_FEELING: 91,
  L3_FUTURE: 94,
  G1: 96,
  G2: 98,
  TRANSITION: 99,
  RESULT: 100,
  COMPLETED: 100,
};

function getProgress(phase: QuizPhase): number {
  return PHASE_PROGRESS[phase] ?? 50;
}

// ── Question resolver ──
function getQuestion(phase: QuizPhase, state: QuizState): Question | null {
  const map: Partial<Record<QuizPhase, Question>> = {
    Q_HAS_EMPLOYEES, Q1, Q1_SOLO, Q2, Q2_SOLO, Q4, Q4_SOLO,
    P1, P2, P_BUSINESS_AGE, P3, P5,
    L1_COST, L_PROBLEM_DURATION: L_PROBLEM_DURATION_BASE,
    L2_RESULT, L2_WHY,
    L3_IMPACT, L3_FEELING, L3_FUTURE,
    G1, G2,
  };

  if (phase === 'L1_CONCRETE') {
    const opts = L1_CONCRETE_OPTIONS[state.profileAxis ?? 'D'] ?? L1_CONCRETE_OPTIONS['D'];
    return { ...L1_CONCRETE_BASE, options: opts };
  }
  if (phase === 'L2_TRIED') {
    const opts = L2_TRIED_OPTIONS[state.profileAxis ?? 'D'] ?? L2_TRIED_OPTIONS['D'];
    return { ...L2_TRIED_BASE, options: opts };
  }

  return map[phase] ?? null;
}

// ── Determine event type for a phase ──
type PhaseCategory = 'scoring' | 'profile' | 'pain' | 'goal';
function getPhaseCategory(phase: QuizPhase): PhaseCategory {
  if (['Q1','Q1_SOLO','Q2','Q2_SOLO','Q4','Q4_SOLO','Q_HAS_EMPLOYEES'].includes(phase)) return 'scoring';
  if (['P1','P2','P_BUSINESS_AGE','P3','P5'].includes(phase)) return 'profile';
  if (['L1_COST','L_PROBLEM_DURATION','L1_CONCRETE','L2_TRIED','L2_RESULT','L2_WHY','L3_IMPACT','L3_FEELING','L3_FUTURE'].includes(phase)) return 'pain';
  if (['G1','G2'].includes(phase)) return 'goal';
  return 'scoring';
}

const fieldMap: Partial<Record<QuizPhase, keyof QuizState>> = {
  P1: 'employeeCount', P2: 'currentRevenue', P_BUSINESS_AGE: 'businessAge',
  P3: 'entrepreneurialEducation', P5: 'identityQuotes',
  L1_COST: 'monthlyCost', L_PROBLEM_DURATION: 'problemDuration',
  L1_CONCRETE: 'concreteProblems', L2_TRIED: 'triedSolutions',
  L2_RESULT: 'solutionResult', L2_WHY: 'priorityReason',
  L3_IMPACT: 'personalImpact', L3_FEELING: 'emotionalState', L3_FUTURE: 'futureConsequences',
  G1: 'mainGoal', G2: 'revenueTarget',
};

// ── Replace [PRENUME] ──
function personalize(text: string, name: string): string {
  return text.replace('[PRENUME]', name || 'Antreprenorule');
}

// ── Phone validation ──
function sanitizePhone(value: string): string {
  const hasPlus = value.startsWith('+');
  const digits = value.replace(/\D/g, '');
  return hasPlus ? '+' + digits : digits;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

// ── Email validation ──
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function QuizShell() {
  const [state, dispatch] = useReducer(quizReducer, undefined, () => createInitialState());
  const [animKey, setAnimKey] = useState(0);
  const prevPhaseRef = useRef(state.phase);
  const progress = getProgress(state.phase);
  const userName = state.formData?.name ?? '';

  // Submit quiz once when reaching RESULT phase
  const hasSubmittedRef = useRef(false);
  useEffect(() => {
    if (state.phase === 'RESULT' && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      submitQuiz(state).then(() => {
        console.log('[quiz] submission sent successfully');
      }).catch((err) => {
        console.error('[quiz] submission failed:', err);
      });
    }
  }, [state.phase]);

  useEffect(() => {
    if (prevPhaseRef.current !== state.phase) {
      prevPhaseRef.current = state.phase;
      setAnimKey(k => k + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.phase]);

  const handleSingleSelect = useCallback((option: AnswerOption, question: Question) => {
    const cat = getPhaseCategory(state.phase);
    const field = fieldMap[state.phase];

    if (state.phase === 'Q_HAS_EMPLOYEES') {
      dispatch({ type: 'ANSWER_P_SINGLE', payload: { field: 'hasEmployees', code: option.code, text: option.text, questionId: question.id } });
      return;
    }

    if (cat === 'scoring') {
      dispatch({ type: 'ANSWER_Q', payload: { code: option.code, text: option.text, scores: option.scores } });
    } else if (cat === 'profile' && field) {
      dispatch({ type: 'ANSWER_P_SINGLE', payload: { field, code: option.code, text: option.text, questionId: question.id } });
    } else if (cat === 'pain' && field) {
      dispatch({ type: 'ANSWER_PAIN_SINGLE', payload: { field, code: option.code, text: option.text, questionId: question.id } });
    } else if (cat === 'goal' && field) {
      dispatch({ type: 'ANSWER_GOAL', payload: { field, code: option.code, text: option.text, questionId: question.id } });
    }
  }, [state.phase]);

  const handleMultiAnswer = useCallback((selected: AnswerOption[], question: Question) => {
    const codes = selected.map(o => o.code);
    const texts = selected.map(o => o.text);
    const cat = getPhaseCategory(state.phase);
    const field = fieldMap[state.phase];

    if (cat === 'scoring') {
      const scoresList = selected.map(o => o.scores).filter(Boolean) as any[];
      dispatch({ type: 'ANSWER_Q_MULTI', payload: { codes, texts, scoresList } });
    } else if (cat === 'profile' && field) {
      dispatch({ type: 'ANSWER_P_MULTI', payload: { field, codes, texts, questionId: question.id } });
    } else if (cat === 'pain' && field) {
      dispatch({ type: 'ANSWER_PAIN_MULTI', payload: { field, codes, texts, questionId: question.id } });
    } else if (cat === 'goal' && field) {
      dispatch({ type: 'ANSWER_GOAL_MULTI', payload: { field, codes, texts, questionId: question.id } });
    }
  }, [state.phase]);

  const question = useMemo(() => getQuestion(state.phase, state), [state.phase, state.profileAxis]);

  // Personalize question text
  const personalizedQuestion = useMemo(() => {
    if (!question) return null;
    return {
      ...question,
      text: personalize(question.text, userName),
      subtitle: question.subtitle ? personalize(question.subtitle, userName) : undefined,
    };
  }, [question, userName]);

  // Get pre-selected codes for back navigation
  const getPreSelectedCode = useCallback((): string | undefined => {
    const field = fieldMap[state.phase];
    if (!field) return undefined;
    const val = state[field];
    if (typeof val === 'string') return val;
    return undefined;
  }, [state, state.phase]);

  const getPreSelectedCodes = useCallback((): string[] | undefined => {
    const field = fieldMap[state.phase];
    if (!field) return undefined;
    const val = state[field];
    if (Array.isArray(val)) {
      return val.map((v: any) => typeof v === 'string' ? v : v?.answerCode ?? String(v));
    }
    return undefined;
  }, [state, state.phase]);

  // ── Render helpers ──
  const renderResult = () => {
    const template = getResultTemplate(state.profileAxis);
    const temp = state.temperature ?? 'WARM';
    const cta = template.cta[temp];
    const whatsappUrl = 'https://wa.link/sg786e';


    return (
      <div className="flex flex-col gap-8 w-full max-w-lg mx-auto px-6 pt-8 pb-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest opacity-50 font-archivo">{template.profileLabel}</p>
          <p className="text-sm opacity-60 mt-1">{template.levelLabel}</p>
        </div>
        <h2 className="text-2xl md:text-3xl font-archivo font-bold text-center leading-snug">{template.headline}</h2>
        <div className="flex flex-col gap-4">
          {template.sections.map((s, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <h3 className="font-archivo font-bold text-sm mb-1 text-white">{s.title}</h3>
                  <p className="text-sm text-[var(--viridian-light)] opacity-80 leading-relaxed">{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {template.socialProof && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 border-l-[3px] border-l-[var(--viridian-main)] rounded-r-xl p-5 italic text-sm text-[var(--viridian-ultra)] opacity-80">
            {template.socialProof}
          </div>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => dispatch({ type: 'CTA_CLICKED' })}
          className="w-full py-4 bg-gradient-to-r from-[var(--viridian-dark)] to-[var(--viridian-main)] hover:from-[var(--viridian-main)] hover:to-[var(--viridian-light)] text-white font-archivo font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-center block shadow-lg hover:shadow-[0_0_20px_var(--viridian-main)]"
        >
          {cta.text}
        </a>
        <p className="text-xs text-center opacity-40">{cta.subtext}</p>
      </div>
    );
  };

  const renderCompleted = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 px-6 max-w-md mx-auto">
      <div className="text-5xl">🎉</div>
      <h2 className="text-2xl md:text-3xl font-archivo font-bold text-white">
        Felicitări, {userName}!
      </h2>
      <p className="text-base text-[var(--viridian-ultra)] opacity-80 leading-relaxed">
        Răspunsurile tale au fost înregistrate cu succes.
      </p>
      <p className="text-base text-[var(--viridian-ultra)] opacity-80 leading-relaxed">
        Acum lucrăm la elaborarea planului tău personalizat.
      </p>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 w-full text-left flex flex-col gap-3 shadow-lg">
        <p className="text-sm text-[var(--viridian-light)] opacity-80 flex items-center gap-2">
          <span>⏳</span> Durează puțin, pentru că vrem să fie relevant pentru situația ta.
        </p>
        <p className="text-sm text-[var(--viridian-light)] opacity-80 flex items-center gap-2">
          <span>📩</span> Vei primi planul de la consultant în maximum 24 de ore.
        </p>
      </div>
    </div>
  );

  // ── Main render ──
  const renderPhase = () => {
    switch (state.phase) {
      case 'INTRO':
        return <IntroScreen onStart={() => dispatch({ type: 'START_QUIZ' })} />;

      case 'Q_NAME':
        return (
          <TextInputCard
            question="Cum te cheamă?"
            placeholder="Prenumele tău"
            onSubmit={(t) => dispatch({ type: 'ANSWER_Q_NAME', payload: { text: t } })}
            initialValue={state.formData?.name ?? ''}
            showBack={canGoBack(state.phase)}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        );

      case 'Q_INSTAGRAM':
        return (
          <TextInputCard
            question={`${userName}, care e username-ul tău de Instagram?`}
            placeholder="@username"
            onSubmit={(t) => dispatch({ type: 'ANSWER_Q_INSTAGRAM', payload: { text: t } })}
            initialValue={state.formData?.instagram ?? ''}
            
            showBack={canGoBack(state.phase)}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        );

      case 'Q_EMAIL':
        return (
          <TextInputCard
            question="Care e adresa ta de email?"
            placeholder="email@exemplu.com"
            type="email"
            onSubmit={(t) => dispatch({ type: 'ANSWER_Q_EMAIL', payload: { text: t } })}
            initialValue={state.formData?.email ?? ''}
            note="Datele tale sunt 100% confidențiale și nu vor fi partajate cu terți."
            showBack={canGoBack(state.phase)}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        );

      case 'Q_PHONE':
        return (
          <TextInputCard
            question="Care e numărul tău de telefon?"
            placeholder="+373 6x xxx xxx"
            type="tel"
            onSubmit={(t) => dispatch({ type: 'ANSWER_Q_PHONE', payload: { text: t } })}
            initialValue={state.formData?.phone ?? '+373 '}
            note="Folosim numărul doar pentru a-ți trimite planul personalizat."
            showBack={canGoBack(state.phase)}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        );

      case 'PAUSE_A':
        return (
          <SocialProofPause
            content={PAUSE_A_CONTENT}
            onContinue={() => dispatch({ type: 'CONTINUE_PAUSE' })}
          />
        );

      case 'PAUSE_B':
        return (
          <SocialProofPause
            content={PAUSE_B_CONTENT}
            onContinue={() => dispatch({ type: 'CONTINUE_PAUSE' })}
          />
        );

      case 'TRANSITION':
        return (
          <FinalTransitionScreen
            onComplete={() => dispatch({ type: 'CONTINUE_TRANSITION' })}
          />
        );

      case 'RESULT':
        return renderResult();

      case 'COMPLETED':
        return renderCompleted();

      default: {
        if (personalizedQuestion) {
          return (
            <QuestionCard
              key={state.phase}
              question={personalizedQuestion}
              onAnswer={(option) => handleSingleSelect(option, personalizedQuestion)}
              onMultiAnswer={(options) => handleMultiAnswer(options, personalizedQuestion)}
              onBack={canGoBack(state.phase) ? () => dispatch({ type: 'GO_BACK' }) : undefined}
              showBack={canGoBack(state.phase)}
              preSelectedCode={getPreSelectedCode()}
              preSelectedCodes={getPreSelectedCodes()}
            />
          );
        }
        return <div className="text-center pt-20 opacity-50">Se încarcă...</div>;
      }
    }
  };

  const showHeader = !['INTRO', 'TRANSITION', 'RESULT', 'COMPLETED'].includes(state.phase);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 min-h-screen flex flex-col">
      {showHeader && (
        <header className="mb-8 w-full animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[var(--viridian-main)] font-archivo text-xl font-bold tracking-widest">
              VICTOR MORAR
            </div>
            {canGoBack(state.phase) && (
              <button
                onClick={() => dispatch({ type: 'GO_BACK' })}
                className="text-sm font-medium text-[var(--viridian-light)] opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Înapoi
              </button>
            )}
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full progress-fill transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>
      )}

      <main key={animKey} className="flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
        {renderPhase()}
      </main>
    </div>
  );
}
