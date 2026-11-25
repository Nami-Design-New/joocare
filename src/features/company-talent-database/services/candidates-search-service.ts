import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch, type ApiFetchResponse } from '@/shared/lib/fetch-manager';
import {
  TALENT_AVATAR_FALLBACK,
  TALENT_PAGE_SIZE,
} from '../constants/talent-filters';
import type {
  ApiTalentCandidate,
  ApiTalentCandidatesPage,
  TalentCandidate,
  TalentCandidatesPage,
  TalentSearchFilters,
} from '../types/talent-database.types';
import { appendTalentFilterParams } from '../utils/talent-search-params';

type RequestOptions = { token: string; locale: string };

// Laravel page: rows in `data`, paging fields beside it.
type CandidatesSearchResponse = ApiFetchResponse<ApiTalentCandidate[]> &
  Partial<Omit<ApiTalentCandidatesPage, 'data'>>;

export async function searchCandidates(
  { filters, search, page }: TalentSearchFilters,
  { token, locale }: RequestOptions,
): Promise<TalentCandidatesPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(TALENT_PAGE_SIZE),
    page: String(page),
  });
  appendTalentFilterParams(params, filters);
  // Not supported by the API yet (asked backend for a name / email search).
  const trimmedSearch = search.trim();
  if (trimmedSearch) params.set('search', trimmedSearch);

  const { ok, data, message } = await apiFetch<ApiTalentCandidate[]>(
    `${getCompanyApiUrl()}/candidates/search?${params.toString()}`,
    { method: 'GET', token, locale, cache: 'no-store' },
  );
  if (!ok || !data) throw new Error(message || 'Failed to load candidates.');

  const pageData: CandidatesSearchResponse = data;
  return {
    candidates: (pageData.data ?? []).map(mapTalentCandidate),
    total: pageData.total ?? 0,
    perPage: pageData.per_page ?? TALENT_PAGE_SIZE,
  };
}

function mapTalentCandidate(candidate: ApiTalentCandidate): TalentCandidate {
  return {
    id: String(candidate.id),
    name: candidate.name,
    email: candidate.email ?? '',
    phone: [candidate.phone_code, candidate.phone].filter(Boolean).join(' '),
    image: candidate.image || TALENT_AVATAR_FALLBACK,
    nationality: candidate.nationality?.name ?? null,
    score: candidate.ai_score,
    cv: candidate.cv,
    isPinned: candidate.is_pinned,
  };
}
