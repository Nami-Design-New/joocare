import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  DashboardJobRow,
  DashboardPage,
  StatisticsOverview,
} from '../index.type';
import { readDashboardPage } from '../utils/dashboard-format';

type RequestOptions = { token: string; locale: string };

export async function getStatisticsOverviewService({
  token,
  locale,
}: RequestOptions): Promise<StatisticsOverview> {
  const result = await apiFetch<StatisticsOverview>(
    getCompanyApiUrl() + '/statistics/overview',
    { method: 'GET', locale, token },
  );
  if (!result.ok || !result.data?.data)
    throw new Error(result.message || 'Unable to load job statistics.');
  return result.data.data;
}

export async function getStatisticsJobsService({
  token,
  locale,
  page,
  perPage,
}: RequestOptions & {
  page: number;
  perPage: number;
}): Promise<DashboardPage<DashboardJobRow>> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(perPage),
    page: String(page),
  });
  const result = await apiFetch<DashboardJobRow[]>(
    getCompanyApiUrl() + '/statistics/jobs?' + params,
    { method: 'GET', locale, token },
  );
  if (!result.ok || !result.data)
    throw new Error(result.message || 'Unable to load jobs.');
  return readDashboardPage<DashboardJobRow>(result.data, page, perPage);
}
