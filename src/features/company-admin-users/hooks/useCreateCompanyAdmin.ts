'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { createCompanyAdmin } from '../services/company-admins-service';
import type { CompanyAdminPayload } from '../types/member.types';
import { useCompanyAdminRequestOptions } from './useCompanyAdminRequestOptions';
import { useInvalidateCompanyAdmins } from './useInvalidateCompanyAdmins';

export function useCreateCompanyAdmin() {
  const t = useTranslations('companyPage.usersManagement');
  const { token, locale } = useCompanyAdminRequestOptions();
  const invalidateCompanyAdmins = useInvalidateCompanyAdmins();

  return useMutation({
    mutationFn: (payload: CompanyAdminPayload) =>
      createCompanyAdmin(payload, { token, locale }),
    onSuccess: async () => {
      toast.success(t('member-added'));
      await invalidateCompanyAdmins();
    },
    onError: (error: Error) => {
      toast.error(error.message || t('save-error'));
    },
  });
}
