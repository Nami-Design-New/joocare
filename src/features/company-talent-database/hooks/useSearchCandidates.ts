'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { TALENT_SEARCH_QUERY_KEY } from '../constants/talent-filters';
import { searchCandidates } from '../services/candidates-search-service';
import type { TalentSearchFilters } from '../types/talent-database.types';

export function useSearchCandidates(
  filters: TalentSearchFilters,
  enabled: boolean,
) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: [
      TALENT_SEARCH_QUERY_KEY,
      locale,
      filters.filters,
      filters.search,
      filters.page,
    ],
    queryFn: () => searchCandidates(filters, { token, locale }),
    enabled: enabled && Boolean(token),
    placeholderData: keepPreviousData,
  });
}
