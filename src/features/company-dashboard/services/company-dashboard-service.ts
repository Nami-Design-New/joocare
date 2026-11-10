import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { CompanyDashboardApi } from '../index.type';

export async function getCompanyDashboardService({
  token,
  locale,
}: {
  token: string;
  locale: string;
}): Promise<CompanyDashboardApi> {
  const result = await apiFetch<CompanyDashboardApi>(
    getCompanyApiUrl() + '/dashboard',
    { method: 'GET', locale, token },
  );
  if (!result.ok || !result.data?.data)
    throw new Error(result.message || 'Unable to load dashboard.');
  return result.data.data;
}
