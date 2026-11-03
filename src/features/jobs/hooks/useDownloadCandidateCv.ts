'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { downloadCv } from '../services/download-cv-service';
import { incrementCvDownloads } from '../services/increment-cv-downloads-service';
import { getCvDownloadFileName } from '../utils';

type DownloadCandidateCvParams = {
  applicationId: string;
  name: string;
  cvUrl: string;
};

export function useDownloadCandidateCv() {
  const t = useTranslations('companyPage.candidates.toasts');
  const locale = useLocale();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      name,
      cvUrl,
    }: DownloadCandidateCvParams) => {
      await incrementCvDownloads({
        token: session?.accessToken ?? '',
        id: Number(applicationId),
      });
      await downloadCv({
        url: cvUrl,
        fileName: getCvDownloadFileName(name, cvUrl),
        locale,
        errorMessage: t('download-cv-failed'),
      });
    },
    // Download counts feed the dashboard.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['company-dashboard'] }),
    onError: (error) => {
      toast.error(error.message || t('download-cv-failed'));
    },
  });
}
