'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { deleteCvDraftService } from '../services/cv-builder-service';
import { cvBuilderQueryKey } from './useGetCvBuilder';

export function useDeleteCvDraft() {
  const locale = useLocale();
  const t = useTranslations('candidatePage.buildCv');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = session?.accessToken;
      if (!token) {
        throw new Error(t('save-errors.session-expired'));
      }
      return deleteCvDraftService({ locale, token });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: cvBuilderQueryKey(locale),
      });
      toast.success(t('delete-success'));
    },
    onError: (error) => {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : t('delete-error'),
      );
    },
  });
}
