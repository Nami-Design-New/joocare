'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getHiringManagerSummary } from '../services/hiring-manager-review-service';
import type { HiringManagerReviewAccess } from '../types/hiring-manager-review.types';

export function useGetHiringManagerSummary(
  { projectId, token, queryScope }: HiringManagerReviewAccess,
  enabled: boolean,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: ['hiring-manager-summary', locale, projectId, queryScope],
    queryFn: () => getHiringManagerSummary({ projectId, token, locale }),
    enabled,
    retry: false,
    gcTime: 0,
  });
}
