import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getStatisticsOverviewService } from '../services/company-statistics-service';

export default function useGetStatisticsOverview({
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
    queryKey: ['company-statistics-overview', locale, accountId],
    queryFn: () => getStatisticsOverviewService({ token, locale }),
    enabled: Boolean(token) && enabled,
  });
}
