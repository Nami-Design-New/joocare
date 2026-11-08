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

// Preview templates until the backend template catalog is available.
export const SCREENING_QUESTION_TEMPLATES = [
  { id: 'education', labelKey: 'education', question: 'Do you have an educational qualification relevant to this role?' },
  { id: 'professional-license', labelKey: 'professional-license', question: 'Do you hold an active professional license from the Saudi Commission for Health Specialties (SCFHS)?' },
  { id: 'medical-license', labelKey: 'medical-license', question: 'Do you hold a valid medical license for the country where this role is based?' },
  { id: 'years-experience', labelKey: 'years-experience', question: 'Do you have at least three years of experience in a related healthcare role?' },
  { id: 'board-certification', labelKey: 'board-certification', question: 'Do you hold a current board certification relevant to this specialty?' },
  { id: 'specialty', labelKey: 'specialty', question: 'Does your clinical specialty match the requirements of this role?' },
  { id: 'hospital-experience', labelKey: 'hospital-experience', question: 'Do you have previous experience working in a hospital setting?' },
  { id: 'icu-experience', labelKey: 'icu-experience', question: 'Do you have previous experience working in an intensive care unit?' },
  { id: 'emergency-experience', labelKey: 'emergency-experience', question: 'Do you have previous experience working in an emergency department?' },
  { id: 'surgery-experience', labelKey: 'surgery-experience', question: 'Do you have previous experience supporting or performing surgical procedures?' },
  { id: 'language', labelKey: 'language', question: 'Are you fluent in the languages required for this role?' },
  { id: 'english-proficiency', labelKey: 'english-proficiency', question: 'Can you communicate professionally in English?' },
  { id: 'arabic-proficiency', labelKey: 'arabic-proficiency', question: 'Can you communicate professionally in Arabic?' },
  { id: 'availability', labelKey: 'availability', question: 'Are you available to start within the timeframe listed for this role?' },
  { id: 'night-shift', labelKey: 'night-shift', question: 'Are you able to work night shifts when scheduled?' },
  { id: 'weekend-shift', labelKey: 'weekend-shift', question: 'Are you able to work weekend shifts when scheduled?' },
  { id: 'relocation', labelKey: 'relocation', question: 'Are you willing to relocate for this position if required?' },
  { id: 'current-location', labelKey: 'current-location', question: 'Are you currently located in the country where this role is based?' },
  { id: 'work-authorization', labelKey: 'work-authorization', question: 'Are you legally authorized to work in the country where this role is based?' },
  { id: 'visa-status', labelKey: 'visa-status', question: 'Do you have a valid visa or residency status for this position?' },
  { id: 'background-check', labelKey: 'background-check', question: 'Are you willing to complete the background checks required for this role?' },
  { id: 'drug-test', labelKey: 'drug-test', question: 'Are you willing to complete a drug screening if required for this role?' },
  { id: 'reference-check', labelKey: 'reference-check', question: 'Can you provide professional references when requested?' },
  { id: 'drivers-license', labelKey: 'drivers-license', question: 'Do you hold a valid driver’s license if this role requires one?' },
  { id: 'computer-skills', labelKey: 'computer-skills', question: 'Are you comfortable using the digital systems required for this role?' },
  { id: 'communication-skills', labelKey: 'communication-skills', question: 'Can you communicate clearly with patients and clinical colleagues?' },
] as const;

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
export const YES_NO_OPTION_IDS: readonly string[] = ['yes', 'no'];
export const SCREENING_QUESTION_TYPES = ['single', 'multi', 'yes-no'] as const;
export const TEMPLATES_PREVIEW_COUNT = 11;

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
      suggestion: 'Consider adding Magnet Hospital experience requirements to attract high-tier nursing leaders.',
      note: 'This can help you attract candidates from top-rated institutions and signal a commitment to excellence.',
    },
  },
  {
    id: 'preview-3',
    author: 'user',
    sentAt: '2026-09-27T09:18:00',
    text: "Here's our requirements file and a sample of the license candidates must hold.",
    attachments: [{ id: 'preview-file', name: 'ICU_Nurse_Requirements.pdf', size: 245760, kind: 'file' }],
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
