import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { LookupOptionSource } from '@/features/candidate-profile/types/profile.types';

type RequestOptions = {
  locale: string;
  token: string;
  page: number;
  search: string;
};

type CompaniesPage = {
  data?: LookupOptionSource[];
  next_page_url?: string | null;
};

type CompaniesPayload = LookupOptionSource[] | CompaniesPage;

export type CompanyLookupPage = {
  companies: LookupOptionSource[];
  nextPage: number | undefined;
};

function getNextPage(nextPageUrl: string | null | undefined) {
  if (!nextPageUrl) return undefined;

  const page = Number(new URL(nextPageUrl).searchParams.get('page'));
  return Number.isFinite(page) && page > 0 ? page : undefined;
}

export async function getCompanyLookupService({
  locale,
  token,
  page,
  search,
}: RequestOptions): Promise<CompanyLookupPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: '10',
    page: String(page),
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  const result = await apiFetch<CompaniesPayload>(
    `${getUserApiUrl()}/companies?${params.toString()}`,
    { locale, token, cache: 'no-store' },
  );
  const payload = result.data?.data;

  if (!result.ok || !payload) {
    throw new Error(result.message ?? '');
  }

  if (Array.isArray(payload)) {
    return { companies: payload, nextPage: undefined };
  }

  return {
    companies: payload.data ?? [],
    nextPage: getNextPage(payload.next_page_url),
  };
}
