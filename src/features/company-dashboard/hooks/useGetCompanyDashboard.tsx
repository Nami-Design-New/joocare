import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getCompanyDashboardService } from '../services/company-dashboard-service';
import type { DashboardMonths } from '../index.type';

export default function useGetCompanyDashboard({
  token,
  accountId,
  months,
  enabled = true,
}: {
  token: string;
  accountId?: string | number;
  months: DashboardMonths;
  enabled?: boolean;
}) {
  const locale = useLocale();
  return useQuery({
    queryKey: ['company-dashboard', locale, accountId, months],
    queryFn: () => getCompanyDashboardService({ token, locale, months }),
    enabled: Boolean(token) && enabled,
    placeholderData: keepPreviousData,
  });
}
