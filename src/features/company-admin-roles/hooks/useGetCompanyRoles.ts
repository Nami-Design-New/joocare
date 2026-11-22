'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getCompanyRoles } from '../services/company-roles-service';

export const COMPANY_ROLES_QUERY_KEY = 'company-roles';

export function useGetCompanyRoles() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: [COMPANY_ROLES_QUERY_KEY, locale],
    queryFn: () => getCompanyRoles({ token, locale }),
    enabled: Boolean(token),
  });
}
