import type { QuizState, ProfileAxis } from './types';

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
    phase: state.hasEmployees ? 'P1' : 'Q_EMAIL',
  };
}
