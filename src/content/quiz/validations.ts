// ============================================================
// Micro-validări empatice — NON-blocante, rare, doar la momente grele.
// Apar ca o linie discretă deasupra ÎNTREBĂRII URMĂTOARE (zero așteptare),
// și doar dacă răspunsul ales chiar a fost unul greu (gating pe coduri).
// Regula criticului: empatie fără lingușeală, max ~12 cuvinte.
// ============================================================

interface ValidationRule {
  codes?: string[];   // dacă lipsește → orice răspuns declanșează
  text: string;
}

const RULES: Record<string, ValidationRule> = {
  // Ramura A
  L1_COST: {
    codes: ['L1CC', 'L1CD'],
    text: 'Costul ăsta se vede și în bani, și în energie.',
  },
  L3_FEELING: {
    codes: ['L3FC', 'L3FD'],
    text: 'Mulți ajung aici. Puțini o recunosc. Contează că ai spus-o.',
  },
  L3_IMPACT: {
    text: 'Asta e partea pe care n-o vede nimeni. O luăm în calcul.',
  },
  // Ramura B
  B_COST: {
    text: 'Ce ai numit aici se recuperează. Dar nu de la sine.',
  },
  B_FEELING: {
    codes: ['BF_B', 'BF_C'],
    text: 'Normal să simți asta. Înseamnă că miza e reală pentru tine.',
  },
};

export function getValidation(questionId: string, codes: string[]): string | null {
  const rule = RULES[questionId];
  if (!rule) return null;
  if (rule.codes && !codes.some(c => rule.codes!.includes(c))) return null;
  return rule.text;
}
