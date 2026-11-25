import type {
  ApiCandidateAssessment,
  CandidateAssessment,
} from '@/features/company-assessments/types/candidate-assessment.types';
import type { JOB_CANDIDATES_TABS, PIPELINE_FILTER_KEYS } from '../constants';

export type JobCandidatesTab = (typeof JOB_CANDIDATES_TABS)[number];

// URL keys and API params share these names.
export type PipelineFilterKey = (typeof PIPELINE_FILTER_KEYS)[number];
export type PipelineFilters = Record<PipelineFilterKey, string>;

export type ApiApplicationCandidate = {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    phone_code: string | null;
    image?: string | null;
    country?: { name: string } | null;
  };
  job_id: number;
  cv: string | null;
  created_at: string;
  updated_at: string;
  // Not returned yet: they wait on the pipeline API (names may change).
  ai_match_score?: number | null;
  is_starred?: boolean;
  added_by?: { name: string } | null;
  assessments?: ApiCandidateAssessment[];
};

export type ApiApplicationsCandidatesPage = {
  data: ApiApplicationCandidate[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PipelineCandidate = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  location: string | null;
  appliedAt: string;
  cvUrl: string | null;
  aiMatchScore: number | null;
  isStarred: boolean;
  addedBy: string | null;
  assessments: CandidateAssessment[];
};

export type PipelineCandidatesPage = {
  candidates: PipelineCandidate[];
  total: number;
  perPage: number;
  lastPage: number;
};

export type AiTalentMatchFilters = {
  search: string;
  order: string;
  country: string;
  license: string;
};
