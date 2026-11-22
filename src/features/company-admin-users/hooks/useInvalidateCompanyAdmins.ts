'use client';

import { useQueryClient } from '@tanstack/react-query';
import { COMPANY_ROLES_QUERY_KEY } from '@/features/company-admin-roles/hooks/useGetCompanyRoles';
import { COMPANY_ADMINS_QUERY_KEY } from './useGetCompanyAdmins';

// Admin changes also change the member count of each role.
export function useInvalidateCompanyAdmins() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [COMPANY_ADMINS_QUERY_KEY] }),
      queryClient.invalidateQueries({ queryKey: [COMPANY_ROLES_QUERY_KEY] }),
    ]);
}
