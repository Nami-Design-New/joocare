'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getRecommendedJobsService } from '../services/recommended-jobs-service';

export const recommendedJobsQueryKey = (locale: string, page: number) => [
  'candidate-recommended-jobs',
  locale,
  page,
];

export default function useGetRecommendedJobs(page: number, enabled: boolean) {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: recommendedJobsQueryKey(locale, page),
    queryFn: () => getRecommendedJobsService({ locale, token, page }),
    enabled: enabled && status === 'authenticated' && Boolean(token),
  });
}
