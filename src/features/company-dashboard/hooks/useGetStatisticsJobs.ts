import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { DASHBOARD_JOBS_PAGE_SIZE } from '../constants/dashboard-config';
import { getStatisticsJobsService } from '../services/company-statistics-service';

export default function useGetStatisticsJobs({
  token,
  accountId,
  page,
  enabled = true,
}: {
  token: string;
  accountId?: string | number;
  page: number;
  enabled?: boolean;
}) {
  const locale = useLocale();
  return useQuery({
    queryKey: ['company-statistics-jobs', locale, accountId, page],
    queryFn: () =>
      getStatisticsJobsService({
        token,
        locale,
        page,
        perPage: DASHBOARD_JOBS_PAGE_SIZE,
      }),
    enabled: Boolean(token) && enabled,
    placeholderData: keepPreviousData,
  });
}
