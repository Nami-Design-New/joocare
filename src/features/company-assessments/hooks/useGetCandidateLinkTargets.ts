'use client';

import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import { getCandidateLinkTargets } from '../services/candidate-link-service';
import type {
  CandidateLinkKind,
  CandidateLinkTargetsPage,
} from '../types/assessment-results.types';
import { ASSESSMENT_LIST_OPTIONS_PAGE_SIZE } from '../constants/assessment-results';

export function useGetCandidateLinkTargets(
  userId: string,
  kind: CandidateLinkKind | null,
  search: string,
) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';
  const query = useInfiniteLookup({
    endpoint: 'company/users',
    queryKey: 'candidate-link-targets',
    search,
    limitPerPage: ASSESSMENT_LIST_OPTIONS_PAGE_SIZE,
    extraParams: { userId, kind },
    enabled: Boolean(token && userId && kind),
    refetchOnMount: true,
    loadPage: (page) =>
      getCandidateLinkTargets(
        {
          userId,
          kind: kind ?? 'project',
          search,
          page,
          limitPerPage: ASSESSMENT_LIST_OPTIONS_PAGE_SIZE,
        },
        { token, locale },
      ),
  });
  const targets =
    query.data?.pages.flatMap((page: CandidateLinkTargetsPage) => page.data) ??
    [];
  return { ...query, targets };
}
