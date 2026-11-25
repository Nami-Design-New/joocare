'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import { updateHiringManagerDecision } from '../services/hiring-manager-review-service';
import type {
  HiringManagerDecisionUpdate,
  HiringManagerReviewAccess,
} from '../types/hiring-manager-review.types';
import { HIRING_MANAGER_CANDIDATES_KEY } from './useGetHiringManagerCandidates';
import { HIRING_MANAGER_SHORTLIST_KEY } from './useGetHiringManagerShortlist';

export function useUpdateHiringManagerDecision({
  projectId,
  token,
  queryScope,
}: HiringManagerReviewAccess) {
  const locale = useLocale();
  const t = useTranslations('companyPage.projects.shared-review');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (decision: HiringManagerDecisionUpdate) =>
      updateHiringManagerDecision({ projectId, token, locale }, decision),
    onSuccess: async () => {
      await Promise.all(
        [HIRING_MANAGER_CANDIDATES_KEY, HIRING_MANAGER_SHORTLIST_KEY].map(
          (key) =>
            queryClient.invalidateQueries({
              queryKey: [key, locale, projectId, queryScope],
            }),
        ),
      );
    },
    onError: (error) => {
      if (getHttpStatusCode(error) !== 401)
        toast.error(t('decision-save-error'));
    },
  });
}
