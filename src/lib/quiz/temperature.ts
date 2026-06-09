import type { Temperature } from './types';

export function mapTemperature(position: number): Temperature {
  if (position === 1) return 'HOT';
  if (position === 2) return 'WARM';
  return 'COLD';
}

export function mapGoalTemperature(position: number): Temperature {
  if (position >= 5) return 'HOT';
  if (position >= 3) return 'WARM';
  return 'COLD';
}
