import { CANDIDATE_ROUTES } from '@/features/candidate-profile/constants';
import type { CandidateAssessmentState } from '../types/candidate-assessment.types';

// An assessment link stays valid for 72 hours after it is emailed.
export const ASSESSMENT_LINK_VALIDITY_HOURS = 72;

// The timer turns into a warning in the last 5 minutes.
export const ASSESSMENT_TIMER_WARNING_SECONDS = 5 * 60;

export const CANDIDATE_ASSESSMENT_ROUTES = {
  take: (id: string) =>
    `${CANDIDATE_ROUTES.assessment}/${encodeURIComponent(id)}`,
  appliedJobs: CANDIDATE_ROUTES.applications,
  jobs: '/jobs',
} as const;

// `?state=` preview values for the design (until the assessment API is ready).
export const CANDIDATE_ASSESSMENT_STATES: readonly CandidateAssessmentState[] =
  ['available', 'expired', 'taken', 'unavailable'];

// Intro rules (keys under `candidatePage.assessment.intro.rules`).
export const ASSESSMENT_RULE_KEYS = [
  'time-limit',
  'questions',
  'no-going-back',
  'continuous-session',
  'passing-criteria',
] as const;

export const ASSESSMENT_OPTION_MARKERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
] as const;
