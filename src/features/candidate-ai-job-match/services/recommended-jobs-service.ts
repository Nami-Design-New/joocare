import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  ApiRecommendedJob,
  JobMatch,
  RecommendedJobsPage,
} from '../types/ai-job-match.types';

type RequestOptions = {
  locale: string;
  token: string;
  page: number;
};

const RECOMMENDED_JOBS_PAGE_SIZE = 10;

type ApiRecommendedJobsPage = {
  data?: ApiRecommendedJob[];
  jobs?: ApiRecommendedJob[];
  current_page?: number | string;
  per_page?: number | string;
  total?: number | string;
  last_page?: number | string;
  meta?: {
    current_page?: number | string;
    per_page?: number | string;
    total?: number | string;
    last_page?: number | string;
  };
};

type ApiRecommendedJobsResponse = ApiRecommendedJob[] | ApiRecommendedJobsPage;

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toPositiveNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getPaginationMetadata(value: unknown): ApiRecommendedJobsPage | undefined {
  if (!isRecord(value)) return undefined;

  const metadata = isRecord(value.meta) ? value.meta : value;
  return {
    current_page:
      typeof metadata.current_page === 'number' ||
      typeof metadata.current_page === 'string'
        ? metadata.current_page
        : undefined,
    per_page:
      typeof metadata.per_page === 'number' ||
      typeof metadata.per_page === 'string'
        ? metadata.per_page
        : undefined,
    total:
      typeof metadata.total === 'number' || typeof metadata.total === 'string'
        ? metadata.total
        : undefined,
    last_page:
      typeof metadata.last_page === 'number' ||
      typeof metadata.last_page === 'string'
        ? metadata.last_page
        : undefined,
  };
}

function hasPaginationMetadata(
  page: ApiRecommendedJobsPage | undefined,
) {
  return Boolean(
    page &&
      (page.current_page !== undefined ||
        page.per_page !== undefined ||
        page.total !== undefined ||
        page.last_page !== undefined),
  );
}

function getSalary(job: ApiRecommendedJob) {
  const amounts = [job.min_salary, job.max_salary]
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map(String);

  if (!job.has_salary && amounts.length === 0) return '';

  const currency =
    job.currency?.symbol ?? job.currency?.code ?? job.currency?.title ?? '';
  return [currency, amounts.join('–')].filter(Boolean).join(' ');
}

function toJobMatch(job: ApiRecommendedJob): JobMatch {
  const score = toNumber(job.match_score ?? job.score);
  const highlights = [job.experience?.title, job.specialty?.title].filter(
    (value): value is string => Boolean(value),
  );

  return {
    id: String(job.id),
    title: job.title ?? job.job_title?.title ?? '',
    companyName: job.company?.name ?? '',
    companyLogo: job.company?.image ?? '',
    location: [job.city?.title, job.country?.title].filter(Boolean).join(', '),
    salary: getSalary(job),
    employmentType: job.employment_type?.title ?? '',
    score,
    highlights,
  };
}

function toRecommendedJobsPage(
  payload: ApiRecommendedJobsResponse,
  requestedPage: number,
  outerResponse?: unknown,
): RecommendedJobsPage {
  const apiJobs = Array.isArray(payload)
    ? payload
    : payload.data ?? payload.jobs ?? [];
  const innerMetadata = Array.isArray(payload)
    ? undefined
    : getPaginationMetadata(payload);
  const outerMetadata = getPaginationMetadata(outerResponse);
  const page = hasPaginationMetadata(innerMetadata)
    ? innerMetadata
    : outerMetadata;
  const perPage = toPositiveNumber(page?.per_page) ?? apiJobs.length;
  const total =
    toPositiveNumber(page?.total) ??
    (toPositiveNumber(page?.last_page) ?? 1) * perPage;

  return {
    jobs: apiJobs.map(toJobMatch),
    currentPage: toPositiveNumber(page?.current_page) ?? requestedPage,
    perPage,
    total,
  };
}

export async function getRecommendedJobsService({
  locale,
  token,
  page,
}: RequestOptions): Promise<RecommendedJobsPage> {
  const params = new URLSearchParams({
    page: String(page),
    pagination: 'on',
    limit_per_page: String(RECOMMENDED_JOBS_PAGE_SIZE),
  });
  const result = await apiFetch<ApiRecommendedJobsResponse>(
    `${getUserApiUrl()}/preferences/jobs?${params.toString()}`,
    { locale, token, cache: 'no-store' },
  );
  const payload = result.data?.data;

  if (result.statusCode === 404 && Array.isArray(payload)) {
    return { jobs: [], currentPage: page, perPage: 0, total: 0 };
  }

  if (!result.ok || !payload) {
    throw new Error(result.message ?? '');
  }

  return toRecommendedJobsPage(payload, page, result.data);
}
