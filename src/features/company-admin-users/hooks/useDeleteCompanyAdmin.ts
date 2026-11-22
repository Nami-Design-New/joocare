'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { deleteCompanyAdmin } from '../services/company-admins-service';
import { useCompanyAdminRequestOptions } from './useCompanyAdminRequestOptions';
import { useInvalidateCompanyAdmins } from './useInvalidateCompanyAdmins';

export function useDeleteCompanyAdmin() {
  const t = useTranslations('companyPage.usersManagement');
  const { token, locale } = useCompanyAdminRequestOptions();
  const invalidateCompanyAdmins = useInvalidateCompanyAdmins();

  return useMutation({
    mutationFn: (memberId: number) =>
      deleteCompanyAdmin(memberId, { token, locale }),
    onSuccess: async () => {
      toast.success(t('member-deleted'));
      await invalidateCompanyAdmins();
    },
    onError: (error: Error) => {
      toast.error(error.message || t('delete-error'));
    },
  });
}
