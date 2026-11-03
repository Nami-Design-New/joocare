export const ALL_RECRUITERS_VALUE = 'all';

export const JOB_SEARCH_DEBOUNCE_MS = 400;

// Preview list until the jobs API returns recruiters.
export const RECRUITER_FILTER_PREVIEW = [
  'Sara Al-Qahtani',
  'Omar Farouk',
  'Nora Al-Otaibi',
];

export const JOB_CANDIDATES_TABS = ['pipeline', 'ai-match'] as const;
export const AI_MATCH_TAB = 'ai-match';

export const JOB_CANDIDATES_PAGE_SIZE = 10;
export const AI_TALENT_MATCH_PAGE_SIZE = 10;

export const CANDIDATE_AVATAR_FALLBACK =
  '/assets/company-projects/candidate-avatar.png';

// Chat isn't built yet; this is the route it will live on.
export const COMPANY_INBOX_PATH = '/company/inbox';

export const PIPELINE_FILTER_KEYS = [
  'search',
  'email',
  'country',
  'nationality',
  'medical_license',
  'recruiter',
  'starred',
  'min_score',
  'max_score',
  'assessment_status',
  'assessment_id',
  'min_assessment_score',
  'max_assessment_score',
] as const;

// Display names for id-based filters, kept in the URL for the filter chips only.
export const PIPELINE_FILTER_LABEL_KEYS = {
  country: 'country_label',
  nationality: 'nationality_label',
} as const;

export const STARRED_FILTER_VALUE = '1';
export const LIST_SEPARATOR = ',';

export const MEDICAL_LICENSE_VALUES = ['1', '0'] as const;

export const ASSESSMENT_STATUS_FILTERS = [
  'passed',
  'failed',
  'absent',
  'grace-period',
  'not-assigned',
] as const;

export const AI_MATCH_ORDERS = ['newest', 'oldest'] as const;
export const AI_MATCH_LICENSES = ['valid', 'none'] as const;
