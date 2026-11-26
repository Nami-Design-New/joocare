import type {
  AssessmentAnswerQuestion,
  AssessmentNote,
  AssessmentResultHeaderData,
} from './assessment-answers.types';
import type { ExternalInvitation } from './assessment-invitation.types';

export type AssessmentResultCategory = {
  id: string;
  name: string;
};

export type AssessmentResultAssessment = {
  id: string;
  categoryId: string;
  name: string;
};

export type CandidateLinkKind = 'job' | 'project';

export type CandidateLinkTarget = {
  id: string;
  name: string;
  organization: string;
  location: string;
  associatedCount: number;
  alreadyLinked?: boolean;
};

export type AssessmentResultCandidate = ExternalInvitation;

export type AssessmentResultRequestOptions = { token: string; locale: string };

// API shapes (snake_case) for /assessments-list and /assessment-results.

export type AssessmentListApiItem = { id: number; name: string };

export type AssessmentListPage = {
  data: AssessmentListApiItem[];
  next_page_url: string | null;
};

export type AssessmentResultStatusApi =
  | 'invitation_pending'
  | 'pending'
  | 'passed'
  | 'failed'
  | 'absent';

export type AssessmentResultUserApi = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  cv?: string | null;
};

export type AssessmentResultStatsApi = Record<
  'total' | 'pending' | 'passed' | 'failed' | 'absent',
  number
> & { invitation_pending?: number };

export type AssessmentResultApiItem = {
  id: number;
  user: AssessmentResultUserApi;
  status: AssessmentResultStatusApi;
  score: number | null;
  score_percent: number | null;
  is_passed: boolean | null;
  submitted_at: string | null;
  started_at: string | null;
  expires_at: string | null;
};

export type AssessmentResultsApiData = {
  stats: AssessmentResultStatsApi;
  users: AssessmentResultApiItem[];
};

export type AssessmentResultNoteApiItem = {
  id: number;
  assessment_result_id: number;
  note: string;
  admin: { id: number; name: string; role_label: string | null } | null;
  is_edited: boolean;
  created_at: string;
};

export type AssessmentResultQuestionApi = {
  id: number;
  number: number;
  question: string;
  type: 'single_choice' | 'multi_choice' | 'yes_no';
  status: 'correct' | 'wrong' | 'missing';
  score: number;
  earned_score: number;
  files: { id: number; file: string }[];
  answers: {
    id: number;
    answer: string;
    is_correct: boolean;
    is_selected: boolean;
  }[];
};

export type AssessmentResultDetailsApiData = {
  candidate: AssessmentResultUserApi;
  assessment: {
    id: number;
    name: string;
    category: string | null;
    passing_score: number;
  };
  result: {
    id: number;
    status: AssessmentResultStatusApi;
    sent_on: string | null;
    started_on: string | null;
    finished_on: string | null;
    expires_at: string | null;
    time_taken_seconds: number | null;
  };
  summary: {
    total_questions: number;
    correct: number;
    wrong: number;
    missing: number;
    score_percent: number | null;
    is_passed: boolean | null;
  };
  notes: AssessmentResultNoteApiItem[];
  questions: AssessmentResultQuestionApi[];
};

// View models used by the results pages.

export type AssessmentResultsFilters = {
  categoryId: string;
  assessmentId: string;
  search: string;
  status: string;
  minScore: string;
  maxScore: string;
  page: number;
  /** Only candidates invited from outside a job application. */
  isExternal: boolean;
  /** `all` or a project id. */
  projectId: string;
};

export type AssessmentResultsSummaryItem = {
  key: string;
  count: number;
  className: string;
};

export type AssessmentResultsList = {
  rows: AssessmentResultCandidate[];
  summary: AssessmentResultsSummaryItem[];
  total: number;
  perPage: number;
};

export type AssessmentResultDetails = AssessmentResultHeaderData & {
  id: string;
  notes: AssessmentNote[];
  questions: AssessmentAnswerQuestion[];
  questionsPage: { total: number; perPage: number };
};

export type SaveResultNotePayload = {
  resultId: string;
  noteId: string | null;
  text: string;
};
