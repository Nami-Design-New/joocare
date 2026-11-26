import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import { buildListParams, readPaginationMeta } from '../utils/pagination';
import type {
  AssessmentResultRequestOptions,
  CandidateJobLinkApi,
  CandidateProjectLinkApi,
  CandidateLinkKind,
  CandidateLinkTargetsPage,
  CandidateLinkResult,
  CandidateLinkResultApi,
} from '../types/assessment-results.types';

type CandidateLinkTargetsRequest = {
  userId: string;
  kind: CandidateLinkKind;
  search: string;
  page: number;
  limitPerPage: number;
};

export async function getCandidateLinkTargets(
  { userId, kind, search, page, limitPerPage }: CandidateLinkTargetsRequest,
  { token, locale }: AssessmentResultRequestOptions,
): Promise<CandidateLinkTargetsPage> {
  const endpoint = `${getCompanyApiUrl()}/users/${encodeURIComponent(userId)}/${kind === 'job' ? 'jobs' : 'projects'}`;
  const params = buildListParams(page, limitPerPage, { search });
  if (kind === 'job') {
    const { ok, data, statusCode } = await apiFetch<CandidateJobLinkApi[]>(
      `${endpoint}?${params}`,
      { token, locale },
    );
    if (!ok) throw createHttpStatusError(statusCode);
    if (!Array.isArray(data?.data)) throw createHttpStatusError(502);
    const { nextPage } = readPaginationMeta(data, limitPerPage);
    return {
      data: data.data.map((job) => ({
        id: String(job.id),
        name: job.title ?? '-',
        organization: '',
        location: [job.city, job.country].filter(Boolean).join(', '),
        associatedCount: job.applications_count,
        alreadyLinked: job.is_applied,
      })),
      next_page_url: nextPage ? `${endpoint}?page=${nextPage}` : null,
    };
  }

  const { ok, data, statusCode } = await apiFetch<CandidateProjectLinkApi[]>(
    `${endpoint}?${params}`,
    { token, locale },
  );
  if (!ok) throw createHttpStatusError(statusCode);
  if (!Array.isArray(data?.data)) throw createHttpStatusError(502);
  const { nextPage } = readPaginationMeta(data, limitPerPage);
  return {
    data: data.data.map((project) => ({
      id: String(project.id),
      name: project.name,
      organization: project.creator ?? '-',
      location: '',
      associatedCount: project.users_count,
      alreadyLinked: project.is_assigned,
    })),
    next_page_url: nextPage ? `${endpoint}?page=${nextPage}` : null,
  };
}

export async function getCandidateLinkResult(
  assessmentId: string,
  userId: string,
  { token, locale }: AssessmentResultRequestOptions,
): Promise<CandidateLinkResult> {
  const { ok, data, statusCode } = await apiFetch<CandidateLinkResultApi>(
    `${getCompanyApiUrl()}/assessments/${encodeURIComponent(assessmentId)}/users/${encodeURIComponent(userId)}/result`,
    { token, locale },
  );
  if (!ok) throw createHttpStatusError(statusCode);
  if (!data?.data?.user) throw createHttpStatusError(502);
  return {
    name: data.data.user.name,
    score: data.data.score_percent,
    statusLabel: data.data.status_label,
  };
}

export async function linkCandidateToJobs(
  userId: string,
  jobIds: string[],
  { token, locale }: AssessmentResultRequestOptions,
): Promise<void> {
  const { ok, message, statusCode } = await apiFetch(
    `${getCompanyApiUrl()}/users/${encodeURIComponent(userId)}/apply-jobs`,
    {
      method: 'POST',
      token,
      locale,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_ids: jobIds.map(Number) }),
    },
  );
  if (!ok) throw createHttpStatusError(statusCode, message ?? undefined);
}
