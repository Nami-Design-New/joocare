import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { ApiCompanyRole, CompanyRole } from '../types/role.types';

type RequestOptions = {
  token: string;
  locale: string;
};

export async function getCompanyRoles({
  token,
  locale,
}: RequestOptions): Promise<CompanyRole[]> {
  const { ok, data, message } = await apiFetch<ApiCompanyRole[]>(
    `${getCompanyApiUrl()}/roles`,
    { method: 'GET', token, locale },
  );
  if (!ok) throw new Error(message || 'Failed to load roles.');

  return (data?.data ?? []).map(mapCompanyRole);
}

function mapCompanyRole(role: ApiCompanyRole): CompanyRole {
  return {
    key: role.value,
    name: role.label,
    memberCount: role.count,
  };
}
