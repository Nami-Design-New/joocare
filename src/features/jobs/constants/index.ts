import type { AiChatMessage } from '../types/job-steps.types';

export const ALL_RECRUITERS_VALUE = 'all';
export const ALL_STATUSES_VALUE = 'all';
export const OTHER_OPTION_VALUE = '__other__';

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

// Recommended skills shown per "show more" click (matches the Figma row count).
export const RECOMMENDED_SKILLS_STEP = 11;

// Illustrations exported from the Figma job-status / post-job modals.
export const JOB_STATUS_MODAL_IMAGES = {
  pause: '/assets/jobs/pause-applications.png',
  resume: '/assets/jobs/resume-applications.png',
  close: '/assets/jobs/close-position.png',
  closed: '/assets/jobs/close-position.png',
  resumed: '/assets/jobs/applications-resumed.png',
  saved: '/assets/jobs/job-published.png',
  published: '/assets/jobs/job-published.png',
  aiJdBuilder: '/assets/jobs/ai-jd-builder.png',
} as const;

// Screening question builder (Figma handoff 12795:114262).
export const SCREENING_OPTION_LIMITS = { min: 2, max: 5, initial: 3 } as const;
export const MAX_SCREENING_QUESTIONS = 10;
export const YES_NO_OPTION_IDS: readonly string[] = ['yes', 'no'];
export const SCREENING_QUESTION_TYPES = ['single', 'multi', 'yes-no'] as const;
export const TEMPLATES_PREVIEW_COUNT = 11;
export const QUESTION_TEMPLATE_HINTS_QUERY_KEY = 'question-template-hints';
export const QUESTION_TEMPLATE_QUERY_KEY = 'question-template';

// "panel" = AI JD Builder chat (Figma 10086:87585); "coming-soon" = modal (11531:110531).
export const AI_JD_BUILDER_MODE: 'panel' | 'coming-soon' = 'panel';
export const AI_CHAT_ACCEPTED_FILES = 'image/*,application/pdf';

// Preview conversation until the AI JD Builder API exists (content stays untranslated).
export const AI_JD_BUILDER_PREVIEW_MESSAGES = [
  {
    id: 'preview-1',
    author: 'user',
    sentAt: '2026-09-27T09:14:00',
    text: 'Must have 10+ years experience in clinical trials and a strong track record of published research in peer-reviewed journals.',
  },
  {
    id: 'preview-2',
    author: 'assistant',
    sentAt: '2026-09-27T09:15:00',
    text: "Based on your prompt, here's a suggestion to make this requirement more compelling and inclusive:",
    insight: {
      suggestion:
        'Consider adding Magnet Hospital experience requirements to attract high-tier nursing leaders.',
      note: 'This can help you attract candidates from top-rated institutions and signal a commitment to excellence.',
    },
  },
  {
    id: 'preview-3',
    author: 'user',
    sentAt: '2026-09-27T09:18:00',
    text: "Here's our requirements file and a sample of the license candidates must hold.",
    attachments: [
      {
        id: 'preview-file',
        name: 'ICU_Nurse_Requirements.pdf',
        size: 245760,
        kind: 'file',
      },
    ],
  },
] satisfies AiChatMessage[];

// Apply flow: preview screening questions + linked assessment until the job details API
// returns them (design review). Set to false to rely on the API data only.
export const JOB_APPLY_PREVIEW_ENABLED = true;
export const APPLY_STEP_KEYS = ['questions', 'cv'] as const;
export const APPLY_CV_ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const CANDIDATE_CV_PROFILE_QUERY_KEY = 'candidate-cv-profile';
export const CANDIDATE_PROFILE_HREF = '/candidate/profile';
export const CANDIDATE_APPLICATIONS_HREF = '/candidate/applications';
export const JOBS_HREF = '/jobs';
