import type { CandidateAssessment } from '@/features/company-assessments/types/candidate-assessment.types';
import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch, type ApiFetchResponse } from '@/shared/lib/fetch-manager';
import {
  CANDIDATE_AVATAR_FALLBACK,
  JOB_CANDIDATES_PAGE_SIZE,
  PIPELINE_FILTER_KEYS,
} from '../constants';
import type {
  ApiApplicationCandidate,
  ApiApplicationsCandidatesPage,
  PipelineCandidate,
  PipelineCandidatesPage,
  PipelineFilters,
} from '../types/job-candidates.types';

type GetApplicationsCandidatesParams = {
  jobId: number;
  page: number;
  filters: Partial<PipelineFilters>;
  token: string;
  locale: string;
};

// The list comes back as a Laravel page: rows in `data`, paging fields beside it.
type ApplicationsCandidatesResponse = ApiFetchResponse<
  ApiApplicationCandidate[]
> &
  Partial<Omit<ApiApplicationsCandidatesPage, 'data'>>;

export async function getApplicationsCandidates({
  jobId,
  page,
  filters,
  token,
  locale,
}: GetApplicationsCandidatesParams): Promise<PipelineCandidatesPage> {
  const params = new URLSearchParams({
    page: String(page),
    pagination: 'on',
    limit_per_page: String(JOB_CANDIDATES_PAGE_SIZE),
  });
  PIPELINE_FILTER_KEYS.forEach((key) => {
    const value = filters[key]?.trim();
    if (value) params.set(key, value);
  });

  const { ok, data, message } = await apiFetch<ApiApplicationCandidate[]>(
    `${getCompanyApiUrl()}/applications/${jobId}?${params.toString()}`,
    { method: 'GET', token, locale },
  );
  if (!ok || !data) throw new Error(message || 'Failed to load candidates.');

  const pageData: ApplicationsCandidatesResponse = data;
  return {
    candidates: (pageData.data ?? []).map(mapPipelineCandidate),
    total: pageData.total ?? 0,
    perPage: pageData.per_page ?? JOB_CANDIDATES_PAGE_SIZE,
    lastPage: pageData.last_page ?? 1,
  };
}

function mapPipelineCandidate(
  candidate: ApiApplicationCandidate,
): PipelineCandidate {
  const { user } = candidate;
  const phone = [user.phone_code, user.phone].filter(Boolean).join(' ');

  return {
    id: String(candidate.id),
    userId: String(user.id),
    name: user.name,
    email: user.email,
    phone,
    image: user.image || CANDIDATE_AVATAR_FALLBACK,
    location: user.country?.name ?? null,
    appliedAt: candidate.created_at,
    cvUrl: candidate.cv,
    aiMatchScore: candidate.ai_match_score ?? null,
    isStarred: candidate.is_starred ?? false,
    addedBy: candidate.added_by?.name ?? null,
    assessments: (candidate.assessments ?? []).map(
      (assessment): CandidateAssessment => ({
        id: String(assessment.id),
        assessmentId: String(assessment.assessment_id),
        title: assessment.title,
        source: assessment.source,
        status:
          assessment.status === 'grace_period'
            ? 'grace-period'
            : assessment.status,
        score: assessment.score,
        sentAt: assessment.sent_at,
        dueAt: assessment.due_at,
      }),
    ),
  };
}
