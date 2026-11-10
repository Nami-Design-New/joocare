import type { MatchLevel } from '../types/ai-job-match.types';

type MatchLevelStyle = {
  /** Legend dot. */
  dot: string;
  /** Score badge: tinted background + label color. */
  soft: string;
  /** Level chip: tinted background, border and label color. */
  chip: string;
  /** Level chip check icon. */
  icon: string;
};

export const MATCH_LEVEL_STYLES: Record<MatchLevel, MatchLevelStyle> = {
  high: {
    dot: 'bg-match-high',
    soft: 'bg-match-high/12 text-match-high-text',
    chip: 'bg-match-high/12 border-match-high text-match-high-text',
    icon: 'text-match-high',
  },
  good: {
    dot: 'bg-match-good',
    soft: 'bg-match-good/12 text-match-good-text',
    chip: 'bg-match-good/12 border-match-good text-match-good-text',
    icon: 'text-match-good',
  },
  review: {
    dot: 'bg-match-review',
    soft: 'bg-match-review/12 text-match-review-text',
    chip: 'bg-match-review/12 border-match-review text-match-review-text',
    icon: 'text-match-review',
  },
  limited: {
    dot: 'bg-match-limited',
    soft: 'bg-match-limited/12 text-match-limited-text',
    chip: 'bg-match-limited/12 border-match-limited text-match-limited-text',
    icon: 'text-match-limited',
  },
  low: {
    dot: 'bg-match-low',
    soft: 'bg-match-low/12 text-match-low-text',
    chip: 'bg-match-low/12 border-match-low text-match-low-text',
    icon: 'text-match-low',
  },
};
