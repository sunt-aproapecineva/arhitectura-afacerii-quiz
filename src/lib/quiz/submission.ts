import type { QuizState } from './types';
import { supabase } from '@/integrations/supabase/client';

export interface QuizSubmission {
  submittedAt: string;
  sessionId: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    instagram: string;
  };
  profile: {
    primary: string;
    secondary: string;
    temperature: string;
  };
  business: {
    hasEmployees: boolean | null;
    employeeCount: string | null;
    currentRevenue: string | null;
    businessAge: string | null;
    entrepreneurialEducation: string[];
    identityQuotes: string[];
  };
  pain: {
    monthlyCost: string | null;
    problemDuration: string | null;
    concreteProblems: string[];
    triedSolutions: string[];
    solutionResult: string | null;
    priorityReason: string | null;
  };
  emotional: {
    personalImpact: string[];
    emotionalState: string | null;
    futureConsequences: string[];
  };
  goals: {
    mainGoal: string | null;
    revenueTarget: string | null;
  };
}

export function buildSubmission(state: QuizState): QuizSubmission {
  return {
    submittedAt: new Date().toISOString(),
    sessionId: state.sessionId,
    contact: {
      name: state.formData?.name ?? '',
      email: state.formData?.email ?? '',
      phone: state.formData?.phone ?? '',
      instagram: state.formData?.instagram ?? '',
    },
    profile: {
      primary: state.profileAxis ?? '',
      secondary: state.secondaryProfile ?? '',
      temperature: state.temperature ?? '',
    },
    business: {
      hasEmployees: state.hasEmployees,
      employeeCount: state.employeeCount,
      currentRevenue: state.currentRevenue,
      businessAge: state.businessAge,
      entrepreneurialEducation: state.entrepreneurialEducation,
      identityQuotes: state.identityQuotes,
    },
    pain: {
      monthlyCost: state.monthlyCost,
      problemDuration: state.problemDuration,
      concreteProblems: state.concreteProblems,
      triedSolutions: state.triedSolutions,
      solutionResult: state.solutionResult,
      priorityReason: state.priorityReason,
    },
    emotional: {
      personalImpact: state.personalImpact,
      emotionalState: state.emotionalState,
      futureConsequences: state.futureConsequences,
    },
    goals: {
      mainGoal: state.mainGoal,
      revenueTarget: state.revenueTarget,
    },
  };
}

export async function submitQuiz(state: QuizState): Promise<void> {
  const data = buildSubmission(state);

  // Save to database via validated edge function
  try {
    const { error } = await supabase.functions.invoke('submit-quiz', {
      body: data,
    });
    if (error) console.warn('[quiz] submission failed:', error);
  } catch (err) {
    console.warn('[quiz] submission failed:', err);
  }

  // Also send to webhook if configured
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL as string | undefined;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn('[quiz] webhook failed:', err);
    }
  }
}
