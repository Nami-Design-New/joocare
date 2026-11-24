'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { PROJECT_QUERY_PREFIXES } from '../constants/project-queries';
import { shareProjectWithHiringManager } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

type ShareProjectVariables = {
  projectId: string;
  managerId: string;
  note: string;
};

export function useShareProject() {
  const t = useTranslations('companyPage.projects');
  const queryClient = useQueryClient();
  const { token, locale } = useProjectRequestOptions();

  return useMutation({
    mutationFn: ({ projectId, managerId, note }: ShareProjectVariables) =>
      shareProjectWithHiringManager(projectId, managerId, note, {
        token,
        locale,
      }),
    onSuccess: async () => {
      await Promise.all(
        PROJECT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('share-error'));
    },
  });
}
