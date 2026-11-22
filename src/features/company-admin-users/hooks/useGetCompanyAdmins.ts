'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCompanyAdmins } from '../services/company-admins-service';
import type { CompanyMembersFilters } from '../types/member.types';
import { useCompanyAdminRequestOptions } from './useCompanyAdminRequestOptions';

export const COMPANY_ADMINS_QUERY_KEY = 'company-admins';

export function useGetCompanyAdmins(filters: CompanyMembersFilters) {
  const { token, locale } = useCompanyAdminRequestOptions();

  return useQuery({
    queryKey: [
      COMPANY_ADMINS_QUERY_KEY,
      locale,
      filters.page,
      filters.search,
      filters.role,
    ],
    queryFn: () => getCompanyAdmins(filters, { token, locale }),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });
}
