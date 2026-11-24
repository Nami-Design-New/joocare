'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getRecruiterOptions } from '../services/recruiters-stats-service';
import { RECRUITERS_STATS_QUERY_KEY } from './useGetRecruitersStats';

export function useGetRecruiterOptions() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: [RECRUITERS_STATS_QUERY_KEY, locale, 'options'],
    queryFn: () => getRecruiterOptions({ token, locale }),
    enabled: Boolean(token),
  });
}
