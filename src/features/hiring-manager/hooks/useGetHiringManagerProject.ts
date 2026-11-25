'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getHiringManagerProject } from '../services/hiring-manager-review-service';
import type { HiringManagerReviewAccess } from '../types/hiring-manager-review.types';

export function useGetHiringManagerProject({
  projectId,
  token,
  queryScope,
}: HiringManagerReviewAccess) {
  const locale = useLocale();

  return useQuery({
    queryKey: ['hiring-manager-project', locale, projectId, queryScope],
    queryFn: () => getHiringManagerProject({ projectId, token, locale }),
    retry: false,
    gcTime: 0,
  });
}
