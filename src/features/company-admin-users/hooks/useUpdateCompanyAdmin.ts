'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { updateCompanyAdmin } from '../services/company-admins-service';
import type { CompanyAdminPayload } from '../types/member.types';
import { useCompanyAdminRequestOptions } from './useCompanyAdminRequestOptions';
import { useInvalidateCompanyAdmins } from './useInvalidateCompanyAdmins';

type UpdateCompanyAdminVariables = {
  memberId: number;
  payload: CompanyAdminPayload;
};

export function useUpdateCompanyAdmin() {
  const t = useTranslations('companyPage.usersManagement');
  const { token, locale } = useCompanyAdminRequestOptions();
  const invalidateCompanyAdmins = useInvalidateCompanyAdmins();

  return useMutation({
    mutationFn: ({ memberId, payload }: UpdateCompanyAdminVariables) =>
      updateCompanyAdmin(memberId, payload, { token, locale }),
    onSuccess: async () => {
      toast.success(t('member-updated'));
      await invalidateCompanyAdmins();
    },
    onError: (error: Error) => {
      toast.error(error.message || t('save-error'));
    },
  });
}
