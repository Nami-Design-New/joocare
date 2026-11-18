'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { saveJobPreferencesService } from '../services/job-preferences-service';
import type { JobPreferences } from '../types/ai-job-match.types';
import { jobPreferencesQueryKey } from './useGetJobPreferences';
import { recommendedJobsQueryKey } from './useGetRecommendedJobs';

export default function useSaveJobPreferences() {
  const locale = useLocale();
  const t = useTranslations('candidatePage.aiJobMatch');
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';

  return useMutation({
    mutationFn: (preferences: JobPreferences) =>
      saveJobPreferencesService(preferences, { locale, token }),
    onSuccess: (preferences) => {
      queryClient.setQueryData(jobPreferencesQueryKey(locale), preferences);
      void queryClient.invalidateQueries({
        queryKey: recommendedJobsQueryKey(locale, 1).slice(0, 2),
      });
      toast.success(t('preferences-saved'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('preferences-save-failed'));
    },
  });
}
