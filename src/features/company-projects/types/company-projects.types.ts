import type {
  ApiCandidateAssessment,
  CandidateAssessment,
} from '@/features/company-assessments/types/candidate-assessment.types';

export type ProjectShareLog = {
  id: string;
  manager: string;
  managerEmail: string;
  sharedBy: string;
  sharedByRole: string;
  date: string;
  time: string;
};

export type CompanyProject = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  recruiter: string;
  candidateInitials: string[];
  additionalCandidates: number;
  isClosed: boolean;
  shareLogs: ProjectShareLog[];
};

export type ProjectCandidate = {
  /** Row id (one per add; the same user can appear more than once). */
  id: string;
  /** Real user id, used to remove the candidate from the project. */
  userId?: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  /** CV file URL (`cv` from the API, as in received applications). */
  cv: string | null;
  /** Profile image URL; preview rows use a local avatar. */
  image?: string | null;
  /** Not returned for project users yet (preview rows only). */
  status?: 'Rejected' | 'Shortlist' | 'Under review';
  /** Not returned for project users yet (preview rows only). */
  assessment?: 'Passed' | 'Failed' | 'Pending' | 'Absent' | 'Not assigned';
  score?: number;
  /** How many assessments the candidate took ("View all (n)" when > 1). */
  assessmentCount?: number;
  /** All the candidate's assessments ("View all (n)" modal); not returned yet. */
  assessments?: CandidateAssessment[];
  /** Ids of the candidate's result in Assessments Results ("View result"). */
  assessmentResult?: { assessmentId: string; candidateId: string };
  interview?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewType?: string;
  scheduledBy?: string;
  scheduledByRole?: string;
  note?: string;
};

export type CandidateAction = {
  type: 'view-cv' | 'remove' | 'note';
  candidateId: string;
} | null;

export type ProjectAction = {
  type: 'share' | 'edit' | 'close' | 'delete' | 'log';
  projectId: string;
} | null;

// Minimal candidate info the project modals need, whichever page opens them.
export type ProjectCandidateRef = {
  id: string;
  name: string;
  /** Real user id; preview-only candidates (talent database) have none. */
  userId?: string;
};

export type CandidateProjectAction = {
  type: 'create' | 'link';
  candidate: ProjectCandidateRef;
} | null;

export type ProjectOption = {
  id: string;
  name: string;
  /** `null` until the API returns project candidate counts. */
  candidateCount: number | null;
};

// Page shape `useInfiniteLookup` reads (`next_page_url` drives "load more").
export type ProjectOptionsPage = {
  data: ProjectOption[];
  next_page_url: string | null;
};

// API shapes for /company/projects.

export type ProjectCreatorApiItem = {
  id: number;
  name: string;
  display_role: string | null;
};

// A candidate added to the project (`users` in GET /projects/{id}).
export type ProjectUserApiItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  cv: string | null;
  image: string | null;
};

// A hiring manager the project was shared with (`assignees`).
export type ProjectAssigneeApiItem = {
  id: number;
  name: string;
  email: string;
  /** "23 November 2026 , 9:30AM" — used as the share date for now. */
  created_at: string;
};

export type ProjectApiItem = {
  id: number;
  is_closed?: boolean;
  name: string;
  created_by: number;
  creator: ProjectCreatorApiItem | null;
  assignees?: ProjectAssigneeApiItem[];
  users?: (string | ProjectUserApiItem)[];
  has_more_users?: boolean;
  remaining_users_count?: number;
  created_at: string;
};

// A row of GET /projects/{id}/users.
export type ProjectMemberApiItem = {
  id: number;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    phone_code: string | null;
    nationality: string | null;
    assessments_count: number;
    /** Not returned yet: same shape as the applications endpoint. */
    assessments?: ApiCandidateAssessment[];
    last_assessment: {
      /** Result id (Assessments Results details). */
      id: number;
      assessment_id: number;
      status: string;
      /** Earned points, not a percentage. */
      score: number | null;
      score_percent?: number | null;
    } | null;
  };
};

export type ProjectDetails = CompanyProject & {
  candidates: ProjectCandidate[];
};

export type ProjectsListPage = {
  items: CompanyProject[];
  total: number;
  perPage: number;
};

export type ProjectRequestOptions = { token: string; locale: string };

export type ProjectRecruiterApiItem = { id: number; name: string };

export type ProjectRecruitersPage = {
  data: { id: string; name: string }[];
  next_page_url: string | null;
};

// `hiring-managers-list` item (same base fields as a company admin).
export type HiringManagerApiItem = { id: number; name: string };

export type HiringManagerOption = { id: string; name: string };
