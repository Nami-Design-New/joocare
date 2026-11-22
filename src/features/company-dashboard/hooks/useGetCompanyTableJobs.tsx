import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { DASHBOARD_JOBS_PAGE_SIZE } from '../constants/dashboard-config';
import { getCompanyJobsService } from '../services/company-dashboard-service';

export default function useGetCompanyTableJobs({
  token,
  page,
  accountId,
  enabled = true,
}: {
  token: string;
  page: number;
  accountId?: string | number;
  enabled?: boolean;
}) {
  const locale = useLocale();
  const query = useQuery({
    queryKey: ['company-jobs-table', locale, accountId, page],
    queryFn: () =>
      getCompanyJobsService({
        token,
        locale,
        page,
        perPage: DASHBOARD_JOBS_PAGE_SIZE,
      }),
    enabled: Boolean(token) && enabled,
  });
  return {
    ...query,
    jobs: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    perPage: query.data?.perPage ?? DASHBOARD_JOBS_PAGE_SIZE,
  };
}
