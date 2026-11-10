import { MATCH_LEVELS } from '../constants';
import type { MatchLevel } from '../types/ai-job-match.types';

export function getMatchLevel(score: number): MatchLevel {
  return (
    MATCH_LEVELS.find((range) => score >= range.min)?.level ??
    MATCH_LEVELS[MATCH_LEVELS.length - 1].level
  );
}
