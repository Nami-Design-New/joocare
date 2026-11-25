'use client';

import { useMutation } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { downloadCv } from '@/features/jobs/services/download-cv-service';
import { getCvDownloadFileName } from '@/features/jobs/utils';
import type { ProjectCandidate } from '../types/company-projects.types';

// Downloads the candidate CV through the app's `/api/download-cv` route
// (the CV host doesn't allow a direct cross-origin download).
export function useDownloadProjectCandidateCv() {
  const t = useTranslations('companyPage.candidates.toasts');
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ name, cv }: Pick<ProjectCandidate, 'name' | 'cv'>) => {
      if (!cv) throw new Error(t('download-cv-failed'));
      return downloadCv({
        url: cv,
        fileName: getCvDownloadFileName(name, cv),
        locale,
        errorMessage: t('download-cv-failed'),
      });
    },
    onError: (error) => toast.error(error.message || t('download-cv-failed')),
  });
}
