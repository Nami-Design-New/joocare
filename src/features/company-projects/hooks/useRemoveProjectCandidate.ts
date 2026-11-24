'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { PROJECT_QUERY_PREFIXES } from '../constants/project-queries';
import { removeProjectCandidate } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

export function useRemoveProjectCandidate(projectId: string) {
  const t = useTranslations('companyPage.projects');
  const queryClient = useQueryClient();
  const { token, locale } = useProjectRequestOptions();

  return useMutation({
    mutationFn: (userId: string) =>
      removeProjectCandidate(projectId, userId, { token, locale }),
    onSuccess: async () => {
      toast.success(t('candidate-removed'));
      await Promise.all(
        PROJECT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('remove-error'));
    },
  });
}
