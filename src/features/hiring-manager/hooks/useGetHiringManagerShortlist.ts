'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getHiringManagerShortlist } from '../services/hiring-manager-review-service';
import type { HiringManagerReviewAccess } from '../types/hiring-manager-review.types';

export const HIRING_MANAGER_SHORTLIST_KEY = 'hiring-manager-shortlist';

export function useGetHiringManagerShortlist(
  { projectId, token, queryScope }: HiringManagerReviewAccess,
  enabled: boolean,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [HIRING_MANAGER_SHORTLIST_KEY, locale, projectId, queryScope],
    queryFn: () => getHiringManagerShortlist({ projectId, token, locale }),
    enabled,
    retry: false,
    gcTime: 0,
  });
}
