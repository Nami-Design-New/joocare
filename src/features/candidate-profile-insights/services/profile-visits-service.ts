import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { PROFILE_VIEWERS_PAGE_SIZE } from '../constants';
import type {
  ApiProfileVisit,
  ApiProfileVisitsPage,
  ApiProfileVisitsResponse,
  ProfileViewer,
  ProfileViewersPage,
} from '../types/profile-insights.types';

type GetProfileVisitsOptions = {
  locale: string;
  token: string;
  page: number;
  search: string;
};

function toPositiveNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumberOrString(value: unknown) {
  return typeof value === 'number' || typeof value === 'string'
    ? value
    : undefined;
}

function getPaginationMetadata(
  value: unknown,
): ApiProfileVisitsPage | undefined {
  if (!isRecord(value) || Array.isArray(value)) {
    return undefined;
  }

  const metadata = isRecord(value.meta) ? value.meta : value;

  return {
    current_page: toNumberOrString(metadata.current_page),
    per_page: toNumberOrString(metadata.per_page),
    total: toNumberOrString(metadata.total),
    last_page: toNumberOrString(metadata.last_page),
  };
}

function toProfileViewer(visit: ApiProfileVisit): ProfileViewer | null {
  const companyId = toPositiveNumber(visit.company?.id);
  const companyName = visit.company?.name?.trim();
  const viewedAt = visit.visited_at ?? visit.created_at;

  if (!companyId || !companyName || !viewedAt) return null;

  return {
    id: String(visit.id ?? `${companyId}-${viewedAt}`),
    companyId,
    companyName,
    companyType: visit.company?.type ?? '',
    logo: visit.company?.image ?? null,
    viewedAt,
  };
}

function toProfileVisitsPage(
  payload: ApiProfileVisitsResponse,
  requestedPage: number,
  outerResponse: unknown,
): ProfileViewersPage {
  const visits = Array.isArray(payload) ? payload : (payload.data ?? []);
  const metadata =
    getPaginationMetadata(payload) ?? getPaginationMetadata(outerResponse);
  const pageSize =
    toPositiveNumber(metadata?.per_page) ?? PROFILE_VIEWERS_PAGE_SIZE;
  const total =
    toPositiveNumber(metadata?.total) ??
    (toPositiveNumber(metadata?.last_page) ?? 1) * pageSize;

  return {
    viewers: visits.flatMap((visit) => {
      const viewer = toProfileViewer(visit);
      return viewer ? [viewer] : [];
    }),
    total: visits.length === 0 && !metadata ? 0 : total,
    page: toPositiveNumber(metadata?.current_page) ?? requestedPage,
    pageSize,
  };
}

export async function getProfileVisitsService({
  locale,
  token,
  page,
  search,
}: GetProfileVisitsOptions): Promise<ProfileViewersPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(PROFILE_VIEWERS_PAGE_SIZE),
    page: String(page),
  });

  if (search) params.set('search', search);

  const result = await apiFetch<ApiProfileVisitsResponse>(
    `${getUserApiUrl()}/visits?${params.toString()}`,
    { locale, token, cache: 'no-store' },
  );
  const payload = result.data?.data;

  if (!result.ok || !payload) throw new Error(result.message ?? '');

  return toProfileVisitsPage(payload, page, result.data);
}
