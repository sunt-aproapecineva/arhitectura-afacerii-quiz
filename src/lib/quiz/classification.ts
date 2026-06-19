import type { QuizState, ProfileAxis, BProfileAxis } from './types';

export function performClassification(state: QuizState): QuizState {
  const { scores } = state;

  const sorted = (Object.keys(scores) as ProfileAxis[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const primary = sorted[0];
  const secondary = sorted[1];

  return {
    ...state,
    profileAxis: primary,
    secondaryProfile: secondary,
    resolvedProfile: primary,
    // Momentul de reveal: profilul începe să se contureze (open loop spre rezultat).
    phase: 'REVEAL_PROFILE',
  };
}

// Ramura B — clasifică începătorul în ANGAJAT / ARS / ZERO.
// La egalitate, ordinea de departajare favorizează profilul mai acționabil.
const B_TIEBREAK: BProfileAxis[] = ['ANGAJAT', 'ARS', 'ZERO'];

export function performBClassification(state: QuizState): QuizState {
  const { bScores } = state;
  const sorted = (Object.keys(bScores) as BProfileAxis[]).sort((a, b) => {
    const diff = bScores[b] - bScores[a];
    if (diff !== 0) return diff;
    return B_TIEBREAK.indexOf(a) - B_TIEBREAK.indexOf(b);
  });

  return {
    ...state,
    bProfile: sorted[0],
    phase: 'REVEAL_PROFILE',
  };
}
