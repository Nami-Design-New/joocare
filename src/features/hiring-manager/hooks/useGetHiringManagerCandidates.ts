'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getHiringManagerCandidates } from '../services/hiring-manager-review-service';
import type {
  HiringManagerCandidateFilters,
  HiringManagerReviewAccess,
} from '../types/hiring-manager-review.types';

export const HIRING_MANAGER_CANDIDATES_KEY = 'hiring-manager-candidates';

export function useGetHiringManagerCandidates(
  { projectId, token, queryScope }: HiringManagerReviewAccess,
  { page, status }: HiringManagerCandidateFilters,
  enabled: boolean,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [
      HIRING_MANAGER_CANDIDATES_KEY,
      locale,
      projectId,
      queryScope,
      page,
      status,
    ],
    queryFn: () =>
      getHiringManagerCandidates(
        { projectId, token, locale },
        { page, status },
      ),
    enabled,
    retry: false,
    gcTime: 0,
  });
}
