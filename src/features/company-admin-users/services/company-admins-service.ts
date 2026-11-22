import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch, type ApiFetchResponse } from '@/shared/lib/fetch-manager';
import { COMPANY_MEMBERS_PAGE_SIZE } from '../constants';
import type {
  ApiCompanyAdmin,
  ApiCompanyAdminsPage,
  CompanyAdminPayload,
  CompanyMember,
  CompanyMembersFilters,
  CompanyMembersPage,
} from '../types/member.types';

type RequestOptions = {
  token: string;
  locale: string;
};

// The list comes back as a Laravel page: rows in `data`, paging fields beside it.
type CompanyAdminsResponse = ApiFetchResponse<ApiCompanyAdmin[]> &
  Partial<Omit<ApiCompanyAdminsPage, 'data'>>;

export async function getCompanyAdmins(
  { page, search, role }: CompanyMembersFilters,
  { token, locale }: RequestOptions,
): Promise<CompanyMembersPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(COMPANY_MEMBERS_PAGE_SIZE),
    page: String(page),
  });
  const trimmedSearch = search.trim();
  if (trimmedSearch) params.set('search', trimmedSearch);
  if (role) params.set('role', role);

  const { ok, data, message } = await apiFetch<ApiCompanyAdmin[]>(
    `${getCompanyApiUrl()}/company-admins?${params.toString()}`,
    { method: 'GET', token, locale },
  );
  if (!ok || !data) throw new Error(message || 'Failed to load members.');

  const pageData: CompanyAdminsResponse = data;
  return {
    members: (pageData.data ?? []).map(mapCompanyMember),
    total: pageData.total ?? 0,
    perPage: pageData.per_page ?? COMPANY_MEMBERS_PAGE_SIZE,
    lastPage: pageData.last_page ?? 1,
  };
}

export async function createCompanyAdmin(
  payload: CompanyAdminPayload,
  { token, locale }: RequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/company-admins`,
    {
      method: 'POST',
      token,
      locale,
      body: createCompanyAdminBody(payload),
    },
  );
  if (!ok) throw new Error(message ?? '');
}

export async function updateCompanyAdmin(
  memberId: number,
  payload: CompanyAdminPayload,
  { token, locale }: RequestOptions,
) {
  const body = createCompanyAdminBody(payload);
  body.append('_method', 'put');

  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/company-admins/${memberId}`,
    { method: 'POST', token, locale, body },
  );
  if (!ok) throw new Error(message ?? '');
}

export async function deleteCompanyAdmin(
  memberId: number,
  { token, locale }: RequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/company-admins/${memberId}`,
    { method: 'DELETE', token, locale, body: new FormData() },
  );
  if (!ok) throw new Error(message ?? '');
}

function createCompanyAdminBody(payload: CompanyAdminPayload) {
  const body = new FormData();
  body.append('name', payload.name);
  body.append('email', payload.email);
  body.append('phone', payload.phone);
  body.append('phone_code', payload.phone_code);
  body.append('role', payload.role);
  body.append('display_role', payload.display_role);
  return body;
}

function mapCompanyMember(admin: ApiCompanyAdmin): CompanyMember {
  const phoneCode = admin.phone_code ?? '';
  const phone = admin.phone ?? '';

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    phone: [phoneCode, phone].filter(Boolean).join(' '),
    phoneNumber: phone ? `${phoneCode}${phone}` : '',
    date: admin.created_at,
    role: admin.role,
    roleValue: admin.role_value,
    displayedRoleName: admin.display_role ?? '',
  };
}
