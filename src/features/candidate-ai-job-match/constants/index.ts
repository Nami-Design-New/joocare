import type {
  JobPreferences,
  MatchLevelRange,
} from '../types/ai-job-match.types';

// Highest range first: the first range whose `min` the score reaches wins.
export const MATCH_LEVELS: readonly MatchLevelRange[] = [
  { level: 'high', min: 85, max: 100 },
  { level: 'good', min: 70, max: 84 },
  { level: 'review', min: 55, max: 69 },
  { level: 'limited', min: 40, max: 54 },
  { level: 'low', min: 0, max: 39 },
];

export const HIGH_MATCH_THRESHOLD = 80;
export const AI_JOB_MATCH_PAGE_SIZE = 10;
export const JOB_FUNCTION_BOTH = 'both';

export const EMPTY_JOB_PREFERENCES: JobPreferences = {
  domainIds: [],
  jobFunction: '',
  jobTitleIds: [],
  companyIds: [],
  countryIds: [],
  seniorityLevelIds: [],
  highMatchOnly: false,
};
