'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { storeUploadedFile } from '@/shared/services/store-uploaded-file-service';
import { CV_BUILDER_SAMPLE_CV_URL } from '../constants';
import { uploadCvBuilderCvService } from '../services/cv-builder-service';
import { cvBuilderQueryKey } from './useGetCvBuilder';

// The preview has no generated file yet, so the sample CV stands in for it:
// store it under `images/...` first, then register that path on the CV.
async function storeCvFile(locale: string) {
  const response = await fetch(CV_BUILDER_SAMPLE_CV_URL);
  if (!response.ok) throw new Error();

  const blob = await response.blob();
  const file = new File([blob], 'cv.pdf', {
    type: blob.type || 'application/pdf',
  });
  const stored = await storeUploadedFile({ file, locale });

  return stored.path;
}

// "Apply" in the CV preview: persist the CV file so applications can use it.
export function useUploadCvBuilderCv() {
  const locale = useLocale();
  const t = useTranslations('candidatePage.buildCv');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = session?.accessToken;

      if (!token) throw new Error(t('save-errors.session-expired'));

      const cvPath = await storeCvFile(locale);

      return uploadCvBuilderCvService({ locale, token, cvPath });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: cvBuilderQueryKey(locale),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : t('view.apply-error'),
      );
    },
  });
}
