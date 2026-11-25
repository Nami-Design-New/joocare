import type {
  CandidateDecision,
  SharedReviewCandidate,
} from '@/features/company-projects/types/shared-review.types';

export type HiringManagerProjectApi = {
  id: number;
  name: string;
  assigned_by: string | null;
  created_at: string;
};

export type HiringManagerCandidateApi = {
  id: number;
  user_id: number;
  name: string;
  specialty: string | null;
  country: string | null;
  experience: string | number | null;
  phone: string | null;
  phone_code: string | null;
  email: string | null;
  status: string;
  status_label: string | null;
  cv: string | null;
};

export type HiringManagerCandidatesPage = {
  candidates: SharedReviewCandidate[];
  total: number;
  perPage: number;
  page: number;
};

export type HiringManagerReviewAccess = {
  projectId: string;
  token: string;
  queryScope: string;
};

export type HiringManagerCandidateFilters = {
  page: number;
  status: string;
};

export type HiringManagerDecisionUpdate = {
  projectCandidateId: string;
  decision: CandidateDecision;
};

export type HiringManagerInterview = {
  project_id: number;
  user_id: number;
  date: string;
  time: string;
  method: 'online' | 'face_to_face';
  note: string | null;
};

export type HiringManagerSummaryApi = {
  project_name: string;
  shortlist_count: number;
  rejected_count: number;
  assigned_by: string | null;
};
