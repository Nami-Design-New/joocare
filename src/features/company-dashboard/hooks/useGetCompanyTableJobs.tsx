import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import type { DashboardJobsPage } from '../index.type';

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
    queryFn: async (): Promise<DashboardJobsPage> => {
      const params = new URLSearchParams({
        page: String(page),
        pagination: 'on',
        limit_per_page: '10',
      });
      const result = await apiFetch<DashboardJobsPage['data']>(
        getCompanyApiUrl() + '/my-jobs?' + params,
        { method: 'GET', token, locale },
      );
      if (!result.ok || !result.data)
        throw new Error(result.message || 'Unable to load jobs.');
      // Pagination metadata is returned alongside the response data by this endpoint.
      const body: unknown = result.data;
      if (
        !body ||
        typeof body !== 'object' ||
        !('data' in body) ||
        !Array.isArray(body.data)
      )
        throw new Error('Invalid jobs response.');
      return {
        data: result.data.data ?? [],
        current_page:
          'current_page' in body && typeof body.current_page === 'number'
            ? body.current_page
            : page,
        last_page:
          'last_page' in body && typeof body.last_page === 'number'
            ? body.last_page
            : 1,
        total:
          'total' in body && typeof body.total === 'number' ? body.total : 0,
        per_page:
          'per_page' in body && typeof body.per_page === 'number'
            ? body.per_page
            : 10,
        next_page_url:
          'next_page_url' in body && typeof body.next_page_url === 'string'
            ? body.next_page_url
            : null,
      };
    },
    enabled: Boolean(token) && enabled,
  });
  return {
    ...query,
    jobs: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    perPage: query.data?.per_page ?? 10,
    lastPage: query.data?.last_page ?? 1,
  };
}
