import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  CompanyDashboard,
  CompanyJob,
  DashboardAdminJobs,
  DashboardMonths,
  DashboardPage,
} from '../index.type';
import { readDashboardPage } from '../utils/dashboard-format';

type RequestOptions = { token: string; locale: string };

export async function getCompanyDashboardService({
  token,
  locale,
  months,
}: RequestOptions & { months: DashboardMonths }): Promise<CompanyDashboard> {
  const params = new URLSearchParams({
    applications_month: months.applications,
    duration_month: months.duration,
    cv_downloads_month: months.cvDownloads,
    visits_month: months.visits,
  });
  const result = await apiFetch<CompanyDashboard>(
    getCompanyApiUrl() + '/dashboard?' + params,
    { method: 'GET', locale, token },
  );
  if (!result.ok || !result.data?.data)
    throw new Error(result.message || 'Unable to load dashboard.');
  return result.data.data;
}

export async function getCompanyJobsService({
  token,
  locale,
  page,
  perPage,
}: RequestOptions & {
  page: number;
  perPage: number;
}): Promise<DashboardPage<CompanyJob>> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(perPage),
    page: String(page),
  });
  const result = await apiFetch<CompanyJob[]>(
    getCompanyApiUrl() + '/my-jobs?' + params,
    { method: 'GET', locale, token },
  );
  if (!result.ok || !result.data)
    throw new Error(result.message || 'Unable to load jobs.');
  return readDashboardPage<CompanyJob>(result.data, page, perPage);
}

export async function getJobsByAdminService({
  token,
  locale,
  month,
  perPage,
}: RequestOptions & {
  month: string;
  perPage: number;
}): Promise<DashboardPage<DashboardAdminJobs>> {
  const params = new URLSearchParams({
    month,
    pagination: 'on',
    limit_per_page: String(perPage),
    page: '1',
  });
  const result = await apiFetch<DashboardAdminJobs[]>(
    getCompanyApiUrl() + '/dashboard/jobs-by-admin?' + params,
    { method: 'GET', locale, token },
  );
  if (!result.ok || !result.data)
    throw new Error(result.message || 'Unable to load recruiters.');
  return readDashboardPage<DashboardAdminJobs>(result.data, 1, perPage);
}
