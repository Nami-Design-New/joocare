import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { DASHBOARD_RECRUITERS_LIMIT } from '../constants/dashboard-config';
import { getJobsByAdminService } from '../services/company-dashboard-service';

export default function useGetJobsByAdmin({
  token,
  accountId,
  month,
  enabled = true,
}: {
  token: string;
  accountId?: string | number;
  month: string;
  enabled?: boolean;
}) {
  const locale = useLocale();
  return useQuery({
    queryKey: ['company-dashboard', 'jobs-by-admin', locale, accountId, month],
    queryFn: () =>
      getJobsByAdminService({
        token,
        locale,
        month,
        perPage: DASHBOARD_RECRUITERS_LIMIT,
      }),
    enabled: Boolean(token) && enabled,
    placeholderData: keepPreviousData,
  });
}
