'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getRecruitersStats } from '../services/recruiters-stats-service';

export const RECRUITERS_STATS_QUERY_KEY = 'recruiters-stats';

type UseGetRecruitersStatsParams = {
  page: number;
  adminId: string;
};

export function useGetRecruitersStats({
  page,
  adminId,
}: UseGetRecruitersStatsParams) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: [RECRUITERS_STATS_QUERY_KEY, locale, page, adminId],
    queryFn: () => getRecruitersStats({ page, adminId }, { token, locale }),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });
}
