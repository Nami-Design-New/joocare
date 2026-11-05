import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getCompanyDashboardService } from '../services/company-dashboard-service';

export default function useGetCompanyDashboard({
  token,
  accountId,
  enabled = true,
}: {
  token: string;
  accountId?: string | number;
  enabled?: boolean;
}) {
  const locale = useLocale();
  return useQuery({
    queryKey: ['company-dashboard', locale, accountId],
    queryFn: () => getCompanyDashboardService({ token, locale }),
    enabled: Boolean(token) && enabled,
  });
}
