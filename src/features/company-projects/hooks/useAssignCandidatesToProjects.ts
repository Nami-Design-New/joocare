'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { PROJECT_QUERY_PREFIXES } from '../constants/project-queries';
import { assignCandidatesToProjects } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

type AssignCandidatesVariables = { userIds: string[]; projectIds: string[] };

export function useAssignCandidatesToProjects() {
  const t = useTranslations('companyPage.projects.candidate-projects');
  const queryClient = useQueryClient();
  const { token, locale } = useProjectRequestOptions();

  return useMutation({
    mutationFn: ({ userIds, projectIds }: AssignCandidatesVariables) =>
      assignCandidatesToProjects(userIds, projectIds, { token, locale }),
    onSuccess: async () => {
      await Promise.all(
        PROJECT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('assign-error'));
    },
  });
}
