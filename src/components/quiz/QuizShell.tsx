import { useReducer, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Hand, Share2, Check, Clock, MessageCircle, FileCheck2,
  Search, Wrench, TrendingUp, ClipboardList, BarChart3, Link2, CloudFog,
  RefreshCw, Building2, Lightbulb, Compass, Flame, Sprout, Map as MapIcon,
  ArrowRight, Sparkles, ArrowUpRight,
} from 'lucide-react';
import { quizReducerTracked, createInitialState, canGoBack } from '@/lib/quiz/machine';
import { getResultTemplate } from '@/lib/quiz/results';
import { getBResultTemplate, PAUSE_B1_START, PAUSE_B2_START } from '@/content/quiz/results-start';
import { submitQuiz } from '@/lib/quiz/submission';
import { getScore } from '@/lib/quiz/score';
import { getChapterPosition, milestoneLine } from '@/content/quiz/chapters';
import { getValidation } from '@/content/quiz/validations';
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
import {
  Q_STAGE, B_SITUATION, B_BLOCKER, B_DREAM, B_INVEST, B_READINESS,
  B_DELAY, B_COST, B_FEELING, B_FUTURE, B_GOAL,
} from '@/content/quiz/branch-start';
import type { Question, AnswerOption, QuizPhase, QuizState, ResultTemplate } from '@/lib/quiz/types';
import { ResultScore } from './ResultScore';
import { ProfileRevealScreen } from './ProfileRevealScreen';
import { IntroScreen } from './IntroScreen';
import { QuestionCard } from './QuestionCard';
import { TextInputCard } from './TextInputCard';
import { SocialProofPause } from './SocialProofPause';
import { FinalTransitionScreen } from './FinalTransitionScreen';

// ── Progress calculation ──
// Map each phase to a progress % (0-100). Solo variants share the same slot.
const PHASE_PROGRESS: Partial<Record<QuizPhase, number>> = {
  INTRO: 0,
  Q_NAME: 4,
  Q_STAGE: 6,
  Q_HAS_EMPLOYEES: 8,
  Q1: 12, Q1_SOLO: 12,
  Q_INSTAGRAM: 16,
  Q2: 20, Q2_SOLO: 20,
  Q4: 24, Q4_SOLO: 24,
  REVEAL_PROFILE: 26,
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

// Ramura B e mai scurtă — propriul ei progres (cheile comune au valori diferite față de A).
const B_PROGRESS: Partial<Record<QuizPhase, number>> = {
  Q_STAGE: 6,
  B_SITUATION: 11,
  B_BLOCKER: 18,
  B_DREAM: 25,
  REVEAL_PROFILE: 29,
  B_INVEST: 33,
  B_READINESS: 40,
  Q_INSTAGRAM: 47,
  Q_EMAIL: 54,
  Q_PHONE: 61,
  PAUSE_B1: 66,
  B_DELAY: 72,
  B_COST: 78,
  B_FEELING: 84,
  B_FUTURE: 90,
  PAUSE_B2: 93,
  B_GOAL: 96,
  TRANSITION: 99,
  RESULT: 100,
  COMPLETED: 100,
};

function getProgress(phase: QuizPhase, state: QuizState): number {
  if (state.branch === 'B' && B_PROGRESS[phase] !== undefined) return B_PROGRESS[phase]!;
  return PHASE_PROGRESS[phase] ?? 50;
}

// ── Question resolver ──
function getQuestion(phase: QuizPhase, state: QuizState): Question | null {
  const map: Partial<Record<QuizPhase, Question>> = {
    Q_STAGE,
    // Ramura B
    B_SITUATION, B_BLOCKER, B_DREAM, B_INVEST, B_READINESS,
    B_DELAY, B_COST, B_FEELING, B_FUTURE, B_GOAL,
    // Ramura A
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
// 'bscoring' = întrebări de scoring pe ramura B (ANGAJAT/ARS/ZERO).
type PhaseCategory = 'scoring' | 'bscoring' | 'profile' | 'pain' | 'goal';
function getPhaseCategory(phase: QuizPhase): PhaseCategory {
  if (['Q1','Q1_SOLO','Q2','Q2_SOLO','Q4','Q4_SOLO','Q_HAS_EMPLOYEES'].includes(phase)) return 'scoring';
  if (['B_SITUATION','B_BLOCKER','B_DREAM'].includes(phase)) return 'bscoring';
  if (['P1','P2','P_BUSINESS_AGE','P3','P5','B_INVEST','B_READINESS'].includes(phase)) return 'profile';
  if (['L1_COST','L_PROBLEM_DURATION','L1_CONCRETE','L2_TRIED','L2_RESULT','L2_WHY','L3_IMPACT','L3_FEELING','L3_FUTURE','B_DELAY','B_COST','B_FEELING','B_FUTURE'].includes(phase)) return 'pain';
  if (['G1','G2','B_GOAL'].includes(phase)) return 'goal';
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
  // Ramura B (reutilizăm câmpurile de pain/goal acolo unde se potrivesc semantic)
  B_SITUATION: 'bSituation', B_BLOCKER: 'bBlocker',
  B_INVEST: 'bInvest', B_READINESS: 'bReadiness',
  B_DELAY: 'problemDuration', B_COST: 'personalImpact',
  B_FEELING: 'emotionalState', B_FUTURE: 'futureConsequences',
  B_GOAL: 'mainGoal',
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

// ── CTA — link-uri configurabile per acțiune ──
// TODO(Victor): înlocuiește booking cu un calendar (cal.com/Calendly) și
// miniCurs/start cu landing-urile reale. Până atunci, fallback pe WhatsApp.
const WHATSAPP_LINK = 'https://wa.link/sg786e';
const CTA_LINKS: Record<string, string> = {
  book_call: WHATSAPP_LINK,
  whatsapp: WHATSAPP_LINK,
  waitlist: WHATSAPP_LINK,
  email_result: WHATSAPP_LINK,
  lesson_beginner: WHATSAPP_LINK,
  lesson_expert: WHATSAPP_LINK,
  mini_curs: WHATSAPP_LINK,
  start: WHATSAPP_LINK,
};
function resolveCtaUrl(action: string, explicitUrl?: string): string {
  return explicitUrl ?? CTA_LINKS[action] ?? WHATSAPP_LINK;
}

// WhatsApp cu mesaj precompletat — scoate momentul stânjenitor „ce să-i scriu?".
// Cere VITE_WHATSAPP_NUMBER (fără +); altfel cade pe shortlink-ul existent.
function buildWhatsappUrl(action: string, explicitUrl: string | undefined, prefill: string): string {
  const num = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, '');
  if (num) return `https://wa.me/${num}?text=${encodeURIComponent(prefill)}`;
  return resolveCtaUrl(action, explicitUrl);
}

// ── Emoji → iconuri stroke (lucide) — un singur limbaj vizual, identic pe orice telefon ──
const EMOJI_ICON: Record<string, typeof Search> = {
  '🔍': Search, '🔧': Wrench, '📈': TrendingUp, '📋': ClipboardList, '📊': BarChart3,
  '⛓️': Link2, '🌫️': CloudFog, '🌀': RefreshCw, '🏗️': Building2, '💡': Lightbulb,
  '🧭': Compass, '🪜': ArrowUpRight, '🔥': Flame, '🌱': Sprout, '🗺️': MapIcon,
  '➡️': ArrowRight, '✦': Sparkles,
};

function SectionIcon({ emoji }: { emoji: string }) {
  const Icon = EMOJI_ICON[emoji];
  if (!Icon) return <span className="text-xl">{emoji}</span>;
  return <Icon className="w-5 h-5 text-[var(--viridian-light)]" strokeWidth={1.75} />;
}


// ── Persistență sesiune (save/resume) ──
const STORAGE_KEY = 'vm_quiz_state_v3'; // v3: + branch B, timeline, reveal
const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // 6h

function loadSavedState(): QuizState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as QuizState;
    // Nu relua ecranele terminale sau o sesiune veche.
    if (!s || !s.phase || s.phase === 'INTRO' || s.phase === 'COMPLETED' || s.phase === 'TRANSITION') return null;
    if (!s.startedAt || Date.now() - s.startedAt > SESSION_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

function wasSubmitted(sessionId: string): boolean {
  try { return localStorage.getItem('vm_quiz_submitted_' + sessionId) === '1'; }
  catch { return false; }
}
function markSubmitted(sessionId: string): void {
  try { localStorage.setItem('vm_quiz_submitted_' + sessionId, '1'); }
  catch { /* ignore */ }
}

export function QuizShell() {
  const [state, rawDispatch] = useReducer(quizReducerTracked, undefined, () => loadSavedState() ?? createInitialState());
  // Direcția navigării (pentru tranziții): GO_BACK = -1, orice altceva = +1.
  const dirRef = useRef(1);
  const dispatch = useCallback((event: Parameters<typeof rawDispatch>[0]) => {
    dirRef.current = event.type === 'GO_BACK' ? -1 : 1;
    rawDispatch(event);
  }, []);
  const reducedMotion = useReducedMotion();
  const progress = getProgress(state.phase, state);
  const userName = state.formData?.name ?? '';

  // Capitole: poziție curentă + momentul de „capitol încheiat" (pasiv, în header).
  const chapter = getChapterPosition(state.phase, state.branch);
  const prevChapterRef = useRef(chapter.index);
  const [milestone, setMilestone] = useState<{ seg: number; text: string } | null>(null);
  const prevChapterNameRef = useRef(chapter.name);
  useEffect(() => {
    const prev = prevChapterRef.current;
    const prevName = prevChapterNameRef.current;
    prevChapterRef.current = chapter.index;
    if (chapter.name) prevChapterNameRef.current = chapter.name;
    if (chapter.index > prev && prev >= 0 && prev < chapter.total) {
      setMilestone({ seg: prev, text: milestoneLine(prevName) });
      const t = setTimeout(() => setMilestone(null), 2000);
      return () => clearTimeout(t);
    }
  }, [chapter.index, chapter.name, chapter.total]);

  // Empatie non-blocantă: setată la răspunsurile grele, afișată pe ÎNTREBAREA URMĂTOARE.
  const [empathy, setEmpathy] = useState<string | null>(null);
  const [shareDone, setShareDone] = useState(false);

  // Sus la fiecare pas — salt instant (smooth ar concura cu animația de intrare).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [state.phase]);

  // „Bine ai revenit" — dacă sesiunea a fost reluată din localStorage.
  const [showResume, setShowResume] = useState(
    () => state.phase !== 'INTRO' && state.phase !== 'COMPLETED' && state.phase !== 'RESULT'
  );
  useEffect(() => {
    if (!showResume) return;
    const t = setTimeout(() => setShowResume(false), 6500);
    return () => clearTimeout(t);
  }, [showResume]);

  // Persistă progresul — quiz lung, refresh/standby nu mai pierde nimic.
  useEffect(() => {
    try {
      if (state.phase === 'COMPLETED') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* localStorage indisponibil — ignorăm */ }
  }, [state]);

  // Submit quiz once when reaching RESULT phase (guard pe sessionId → fără dublu submit la refresh)
  const hasSubmittedRef = useRef(false);
  useEffect(() => {
    if (state.phase === 'RESULT' && !hasSubmittedRef.current && !wasSubmitted(state.sessionId)) {
      hasSubmittedRef.current = true;
      markSubmitted(state.sessionId);
      submitQuiz(state).then(() => {
        console.log('[quiz] submission sent successfully');
      }).catch((err) => {
        console.error('[quiz] submission failed:', err);
      });
    }
  }, [state.phase]);

  const handleSingleSelect = useCallback((option: AnswerOption, question: Question) => {
    const cat = getPhaseCategory(state.phase);
    const field = fieldMap[state.phase];

    // Empatia (dacă răspunsul e unul greu) apare pe întrebarea următoare — zero așteptare.
    setEmpathy(getValidation(question.id, [option.code]));

    if (state.phase === 'Q_STAGE') {
      dispatch({ type: 'ANSWER_Q_STAGE', payload: { branch: option.code === 'STAGE_B' ? 'B' : 'A', code: option.code, text: option.text } });
      return;
    }

    if (state.phase === 'Q_HAS_EMPLOYEES') {
      dispatch({ type: 'ANSWER_P_SINGLE', payload: { field: 'hasEmployees', code: option.code, text: option.text, questionId: question.id } });
      return;
    }

    if (cat === 'bscoring') {
      dispatch({ type: 'ANSWER_B', payload: { field, code: option.code, text: option.text, bScores: option.bScores, questionId: question.id } });
    } else if (cat === 'scoring') {
      dispatch({ type: 'ANSWER_Q', payload: { code: option.code, text: option.text, scores: option.scores } });
    } else if (cat === 'profile' && field) {
      dispatch({ type: 'ANSWER_P_SINGLE', payload: { field, code: option.code, text: option.text, questionId: question.id } });
    } else if (cat === 'pain' && field) {
      dispatch({ type: 'ANSWER_PAIN_SINGLE', payload: { field, code: option.code, text: option.text, questionId: question.id } });
    } else if (cat === 'goal' && field) {
      dispatch({ type: 'ANSWER_GOAL', payload: { field, code: option.code, text: option.text, questionId: question.id } });
    }
  }, [state.phase, dispatch]);

  const handleMultiAnswer = useCallback((selected: AnswerOption[], question: Question) => {
    const codes = selected.map(o => o.code);
    const texts = selected.map(o => o.text);
    const cat = getPhaseCategory(state.phase);
    const field = fieldMap[state.phase];

    setEmpathy(getValidation(question.id, codes));

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
  }, [state.phase, dispatch]);

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
    const template: ResultTemplate = state.branch === 'B'
      ? getBResultTemplate(state.bProfile)
      : getResultTemplate(state.profileAxis);
    const temp = state.temperature ?? 'WARM';
    const cta = template.cta[temp];
    const score = getScore(state);

    // WhatsApp precompletat — DM-ul pornește cald, fără „ce să-i scriu?".
    const prefill = `Salut! Sunt ${userName || 'un antreprenor'}. Am făcut diagnosticul Arhitectura Afacerii — profil: ${template.profileLabel}, scor ${score.value}/100. Vreau planul personalizat.`;
    const whatsappUrl = buildWhatsappUrl(cta.action, cta.url, prefill);

    // Registrul de certificat: nume + dată.
    const dateStr = new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

    // Oglindim cuvintele omului — nimic nu te face mai văzut decât propria propoziție.
    const mirrorSource = state.branch === 'B'
      ? (state.bBlocker || state.futureConsequences[0])
      : (state.concreteProblems[0] || state.personalImpact[0] || state.identityQuotes[0]);
    const mirror = mirrorSource && mirrorSource.length <= 110 ? mirrorSource : null;

    // Share discret — invită la quiz, nu expune rezultatul personal.
    const handleShare = async () => {
      dispatch({ type: 'SHARED' });
      const url = window.location.origin + '/quiz';
      const text = 'Câteva minute, întrebări directe, diagnostic personalizat la final. Vezi unde ești și tu:';
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Arhitectura Afacerii — diagnostic', text, url });
        } else {
          await navigator.clipboard.writeText(`${text} ${url}`);
          setShareDone(true);
          setTimeout(() => setShareDone(false), 2500);
        }
      } catch { /* utilizatorul a anulat — nimic de făcut */ }
    };

    return (
      <div className="flex flex-col gap-8 w-full max-w-lg mx-auto px-6 pt-10 pb-16">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="font-archivo uppercase tracking-[0.3em] text-[10px] text-[var(--viridian-light)]/55 mb-3">
            Diagnostic personalizat{userName ? ` pentru ${userName}` : ''} · {dateStr}
          </p>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-archivo text-[var(--viridian-light)] px-3 py-1.5 rounded-full border border-[var(--viridian-main)]/30 bg-[var(--viridian-main)]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--viridian-main)] shadow-[0_0_8px_var(--viridian-main)]" />
            {template.profileLabel}
          </span>
          <p className="text-sm opacity-60 mt-3 font-arimo">{template.levelLabel}</p>
        </div>
        <h2 className="hero-text text-2xl md:text-4xl font-archivo font-bold text-center leading-[1.12] tracking-tight">{template.headline}</h2>

        <ResultScore state={state} />

        {mirror && (
          <div className="border-l-2 border-[var(--viridian-main)] pl-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: '120ms' }}>
            <p className="text-sm text-[var(--viridian-ultra)]/80 font-arimo leading-relaxed">
              Ai spus: <span className="italic text-[var(--viridian-light)]">„{mirror}"</span>.
              Diagnosticul de mai jos pornește exact de acolo.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {template.sections.map((s, i) => (
            <div
              key={i}
              className="glass p-5 animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${150 + i * 120}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-[var(--viridian-main)]/12 border border-[var(--viridian-main)]/25">
                  <SectionIcon emoji={s.icon} />
                </span>
                <div>
                  <h3 className="font-archivo font-bold text-sm mb-1.5 text-white uppercase tracking-wide">{s.title}</h3>
                  <p className="text-sm text-[var(--viridian-ultra)]/75 leading-relaxed font-arimo">{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {template.socialProof && (
          <div className="glass border-l-[3px] border-l-[var(--viridian-main)] !rounded-l-md p-5 italic text-sm text-[var(--viridian-ultra)]/80 font-arimo">
            {template.socialProof}
          </div>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => dispatch({ type: 'CTA_CLICKED' })}
          className="btn-premium w-full py-4 text-white font-archivo font-bold text-lg rounded-2xl text-center block"
        >
          {cta.text}
        </a>
        <p className="text-xs text-center text-[var(--viridian-ultra)]/45 font-arimo">{cta.subtext}</p>

        <button
          onClick={handleShare}
          className="mx-auto inline-flex items-center gap-2 text-[13px] font-arimo text-[var(--viridian-light)]/55 hover:text-[var(--viridian-light)] transition-colors py-1"
        >
          <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          {shareDone ? 'Link copiat' : 'Trimite testul unui antreprenor ca tine'}
        </button>
      </div>
    );
  };

  const renderCompleted = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 px-6 max-w-md mx-auto">
      <span className="grid place-items-center w-16 h-16 rounded-2xl bg-[var(--viridian-main)]/12 border border-[var(--viridian-main)]/30 animate-in zoom-in-90 duration-500">
        <FileCheck2 className="w-8 h-8 text-[var(--viridian-light)]" strokeWidth={1.5} />
      </span>
      <h2 className="text-2xl md:text-3xl font-archivo font-bold text-white">
        Diagnosticul tău e înregistrat{userName ? `, ${userName}` : ''}.
      </h2>
      <p className="text-base text-[var(--viridian-ultra)]/80 leading-relaxed font-arimo">
        Consultantul îl are deja în față. Urmează planul tău — construit pe răspunsurile pe care le-ai dat aici.
      </p>
      <div className="glass p-6 w-full text-left flex flex-col gap-4">
        <p className="text-sm text-[var(--viridian-light)]/85 flex items-start gap-3 font-arimo">
          <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.75} />
          Primești planul pe WhatsApp — de la un om, nu de la un robot.
        </p>
        <p className="text-sm text-[var(--viridian-light)]/85 flex items-start gap-3 font-arimo">
          <Clock className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.75} />
          În maximum 24 de ore. Durează pentru că e despre situația ta, nu un șablon.
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
            note="Ca să te recunoaștem când ne scrii. Rămâne între noi."
            showBack={canGoBack(state.phase)}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        );

      case 'Q_EMAIL':
        return (
          <TextInputCard
            question="Care e adresa ta de email?"
            subtitle="Aici îți trimit scorul și planul — să le ai la îndemână, nu doar pe ecranul ăsta."
            placeholder="email@exemplu.com"
            type="email"
            onSubmit={(t) => dispatch({ type: 'ANSWER_Q_EMAIL', payload: { text: t } })}
            initialValue={state.formData?.email ?? ''}
            note="Îți scriu doar eu, doar despre asta. Zero spam, zero liste vândute."
            showBack={canGoBack(state.phase)}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        );

      case 'Q_PHONE':
        return (
          <TextInputCard
            question="Care e numărul tău de telefon?"
            subtitle="Ultimul pas. Pe el îți trimit planul direct, să nu se piardă printre emailuri."
            placeholder="+373 6x xxx xxx"
            type="tel"
            onSubmit={(t) => dispatch({ type: 'ANSWER_Q_PHONE', payload: { text: sanitizePhone(t) } })}
            initialValue={state.formData?.phone ?? '+373 '}
            note="Doar pentru planul tău. Nu te sună nimeni dacă nu ceri tu."
            validate={(v) => isValidPhone(v) ? null : 'Verifică numărul — pe el primești planul.'}
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

      case 'PAUSE_B1':
        return (
          <SocialProofPause
            content={PAUSE_B1_START}
            onContinue={() => dispatch({ type: 'CONTINUE_PAUSE' })}
          />
        );

      case 'PAUSE_B2':
        return (
          <SocialProofPause
            content={PAUSE_B2_START}
            onContinue={() => dispatch({ type: 'CONTINUE_PAUSE' })}
          />
        );

      case 'REVEAL_PROFILE':
        return (
          <ProfileRevealScreen
            state={state}
            onContinue={() => dispatch({ type: 'CONTINUE_REVEAL' })}
          />
        );

      case 'TRANSITION':
        return (
          <FinalTransitionScreen
            branch={state.branch}
            userName={userName}
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
              empathyNote={empathy}
            />
          );
        }
        return <div className="text-center pt-20 opacity-50">Se încarcă...</div>;
      }
    }
  };

  const showHeader = !['INTRO', 'TRANSITION', 'RESULT', 'COMPLETED'].includes(state.phase);
  // Numele capitolului sau, scurt, linia de „capitol încheiat".
  const chapterLabel = milestone
    ? milestone.text
    : chapter.index >= 0 && chapter.index < chapter.total
      ? `${chapter.index + 1}/${chapter.total} · ${chapter.name}`
      : 'Start';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 min-h-screen flex flex-col">
      {showResume && showHeader && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="glass flex items-center gap-3 px-4 py-3 !rounded-2xl">
            <Hand className="w-5 h-5 shrink-0 text-[var(--viridian-light)]" strokeWidth={1.75} />
            <p className="text-sm text-[var(--viridian-ultra)]/85 font-arimo flex-1">
              Bine ai revenit{userName ? `, ${userName}` : ''}! Am păstrat progresul — continui de unde ai rămas.
            </p>
            <button onClick={() => setShowResume(false)} className="text-[var(--viridian-light)]/50 hover:text-[var(--viridian-light)] text-lg leading-none px-1" aria-label="Închide">×</button>
          </div>
        </div>
      )}
      {showHeader && (
        <header className="mb-8 w-full animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--viridian-main)] shadow-[0_0_10px_var(--viridian-main)]" />
              <span className="text-[var(--viridian-ultra)]/90 font-archivo text-base font-bold tracking-[0.28em]">
                VICTOR MORAR
              </span>
            </div>
            {canGoBack(state.phase) && (
              <button
                onClick={() => dispatch({ type: 'GO_BACK' })}
                className="text-sm font-medium text-[var(--viridian-light)] opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Înapoi
              </button>
            )}
          </div>

          {/* Progres segmentat pe capitole — 4 acte, nu o bară anonimă. */}
          <div className="seg-track">
            {Array.from({ length: chapter.total }, (_, i) => {
              const isDone = chapter.index >= 0 && i < chapter.index;
              const isActive = i === chapter.index;
              const fill = isDone ? 1 : isActive ? Math.max(chapter.fraction, 0.06) : 0;
              return (
                <div key={i} className="seg" data-done={isDone || undefined} data-just={milestone?.seg === i || undefined}>
                  <div className="seg-fill" style={{ transform: `scaleX(${fill})` }} />
                  <div className="seg-sheen" />
                </div>
              );
            })}
          </div>
          <div className="mt-2 h-4">
            <span key={chapterLabel} className="block text-[10px] font-archivo uppercase tracking-[0.22em] text-[var(--viridian-light)]/55 animate-in fade-in duration-300">
              {chapterLabel}
            </span>
          </div>
        </header>
      )}

      {/* Remount cu cheie + intrare direcțională. (Fără AnimatePresence:
          mode="wait" în framer-motion 11.0.x poate îngheța exit-ul — fiabilitatea primează.) */}
      <motion.div
        key={state.phase}
        className="flex-1 w-full"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: dirRef.current >= 0 ? 12 : -12 }}
        animate={reducedMotion
          ? { opacity: 1, transition: { duration: 0.15 } }
          : { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.16, 1, 0.3, 1] } }}
      >
        {renderPhase()}
      </motion.div>
    </div>
  );
}
