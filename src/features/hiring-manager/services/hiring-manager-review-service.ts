import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import type {
  CandidateDecision,
  SharedReviewCandidate,
} from '@/features/company-projects/types/shared-review.types';
import { SHARED_REVIEW_PAGE_SIZE } from '@/features/company-projects/constants/shared-review-options';
import type {
  HiringManagerCandidateApi,
  HiringManagerCandidateFilters,
  HiringManagerCandidatesPage,
  HiringManagerDecisionUpdate,
  HiringManagerInterview,
  HiringManagerProjectApi,
  HiringManagerSummaryApi,
} from '../types/hiring-manager-review.types';

type ReviewRequest = { projectId: string; token: string; locale: string };

const MISSING_FIELD = '—';
const STATUS_FROM_API = new Map<string, CandidateDecision>([
  ['under_review', 'Under review'],
  ['shortlist', 'Shortlist'],
  ['shortlisted', 'Shortlist'],
  ['rejected', 'Rejected'],
]);
const STATUS_TO_API = new Map<string, string>([
  ['Under review', 'under_review'],
  ['Shortlist', 'shortlist'],
  ['Rejected', 'rejected'],
]);

function getProjectEndpoint(projectId: string) {
  return `${getCompanyApiUrl()}/hiring-manager/projects/${encodeURIComponent(projectId)}`;
}

function mapCandidate(item: HiringManagerCandidateApi): SharedReviewCandidate {
  return {
    id: String(item.id),
    userId: item.user_id == null ? undefined : String(item.user_id),
    name: item.name,
    specialty: item.specialty || MISSING_FIELD,
    nationality: item.country || MISSING_FIELD,
    experience: String(item.experience ?? MISSING_FIELD),
    phone: item.phone
      ? [item.phone_code, item.phone].filter(Boolean).join(' ')
      : MISSING_FIELD,
    email: item.email || MISSING_FIELD,
    status: STATUS_FROM_API.get(item.status),
    statusLabel: item.status_label || undefined,
    cv: item.cv && /^https?:\/\//i.test(item.cv) ? item.cv : null,
    image: '/profile-placeholder.svg',
  };
}

export async function getHiringManagerProject({
  projectId,
  token,
  locale,
}: ReviewRequest) {
  const { ok, data, statusCode, response } =
    await apiFetch<HiringManagerProjectApi>(getProjectEndpoint(projectId), {
      token,
      locale,
      skipUnauthorizedHandler: true,
    });
  if (response.status === 401 || !ok)
    throw createHttpStatusError(response.status === 401 ? 401 : statusCode);
  if (typeof data?.data?.name !== 'string') throw createHttpStatusError(502);

  return {
    name: data.data.name,
    sharedBy: data.data.assigned_by || MISSING_FIELD,
    sharedAt: data.data.created_at || MISSING_FIELD,
  };
}

export async function getHiringManagerCandidates(
  request: ReviewRequest,
  { page, status }: HiringManagerCandidateFilters,
): Promise<HiringManagerCandidatesPage> {
  return getCandidatePage(request, 'users', page, STATUS_TO_API.get(status));
}

async function getCandidatePage(
  { projectId, token, locale }: ReviewRequest,
  endpoint: 'users' | 'shortlist-users',
  page: number,
  apiStatus?: string,
): Promise<HiringManagerCandidatesPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(SHARED_REVIEW_PAGE_SIZE),
    page: String(page),
  });
  if (apiStatus) params.set('status', apiStatus);

  const { ok, data, statusCode, response } = await apiFetch<
    HiringManagerCandidateApi[]
  >(`${getProjectEndpoint(projectId)}/${endpoint}?${params}`, {
    token,
    locale,
    skipUnauthorizedHandler: true,
  });
  if (response.status === 401 || !ok)
    throw createHttpStatusError(response.status === 401 ? 401 : statusCode);
  if (
    !data ||
    !Array.isArray(data.data) ||
    !('total' in data) ||
    typeof data.total !== 'number'
  ) {
    throw createHttpStatusError(502);
  }

  return {
    candidates: data.data.map(mapCandidate),
    total: data.total,
    perPage:
      'per_page' in data &&
      typeof data.per_page === 'number' &&
      data.per_page > 0
        ? data.per_page
        : SHARED_REVIEW_PAGE_SIZE,
    page:
      'current_page' in data &&
      typeof data.current_page === 'number' &&
      data.current_page > 0
        ? data.current_page
        : page,
  };
}

export async function getHiringManagerShortlist(request: ReviewRequest) {
  let page = await getCandidatePage(request, 'shortlist-users', 1);
  const candidates = new Map<string, SharedReviewCandidate>();

  for (;;) {
    for (const candidate of page.candidates) {
      if (!candidate.userId) throw createHttpStatusError(502);
      candidates.set(candidate.userId, candidate);
    }
    if (page.page * page.perPage >= page.total) return [...candidates.values()];

    const nextPage = await getCandidatePage(
      request,
      'shortlist-users',
      page.page + 1,
    );
    if (nextPage.page <= page.page) throw createHttpStatusError(502);
    page = nextPage;
  }
}

export async function updateHiringManagerDecision(
  { projectId, token, locale }: ReviewRequest,
  { projectCandidateId, decision }: HiringManagerDecisionUpdate,
) {
  const { ok, statusCode, response } = await apiFetch(
    `${getProjectEndpoint(projectId)}/users/${encodeURIComponent(projectCandidateId)}/status`,
    {
      method: 'POST',
      token,
      locale,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: STATUS_TO_API.get(decision) }),
      skipUnauthorizedHandler: true,
    },
  );
  if (response.status === 401 || !ok)
    throw createHttpStatusError(response.status === 401 ? 401 : statusCode);
}

export async function scheduleHiringManagerInterviews(
  { token, locale }: ReviewRequest,
  interviews: HiringManagerInterview[],
) {
  const { ok, statusCode, response } = await apiFetch(
    `${getCompanyApiUrl()}/hiring-manager/interviews`,
    {
      method: 'POST',
      token,
      locale,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interviews }),
      skipUnauthorizedHandler: true,
    },
  );
  if (response.status === 401 || !ok)
    throw createHttpStatusError(response.status === 401 ? 401 : statusCode);
}

export async function getHiringManagerSummary({
  projectId,
  token,
  locale,
}: ReviewRequest) {
  const { ok, data, statusCode, response } =
    await apiFetch<HiringManagerSummaryApi>(
      `${getProjectEndpoint(projectId)}/summary`,
      { token, locale, skipUnauthorizedHandler: true },
    );
  if (response.status === 401 || !ok)
    throw createHttpStatusError(response.status === 401 ? 401 : statusCode);
  const summary = data?.data;
  if (
    !summary ||
    typeof summary.project_name !== 'string' ||
    typeof summary.shortlist_count !== 'number' ||
    typeof summary.rejected_count !== 'number'
  ) {
    throw createHttpStatusError(502);
  }

  return {
    projectName: summary.project_name,
    recruiter: summary.assigned_by || MISSING_FIELD,
    shortlisted: summary.shortlist_count,
    rejected: summary.rejected_count,
  };
}

export async function logoutHiringManager(token: string, locale: string) {
  const { ok, statusCode, response } = await apiFetch(
    `${getCompanyApiUrl()}/auth/logout`,
    {
      method: 'POST',
      token,
      locale,
      body: new FormData(),
      skipUnauthorizedHandler: true,
    },
  );
  if (!ok && statusCode !== 401 && response.status !== 401)
    throw createHttpStatusError(statusCode);
}
