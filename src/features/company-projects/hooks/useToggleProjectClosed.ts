'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { PROJECT_QUERY_PREFIXES } from '../constants/project-queries';
import { toggleProjectClosed } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

export function useToggleProjectClosed() {
  const t = useTranslations('companyPage.projects');
  const queryClient = useQueryClient();
  const { token, locale } = useProjectRequestOptions();

  return useMutation({
    mutationFn: (projectId: string) =>
      toggleProjectClosed(projectId, { token, locale }),
    retry: false,
    onSuccess: async () => {
      await Promise.all(
        PROJECT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('project-toggle-error'));
    },
  });
}
