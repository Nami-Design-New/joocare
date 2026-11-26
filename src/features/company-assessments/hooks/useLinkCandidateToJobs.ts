'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { getHttpErrorMessage } from '@/shared/lib/http-error';
import { APPLICATION_CANDIDATES_QUERY_KEY } from '@/features/jobs/hooks/useGetApplicationsCandidates';
import { linkCandidateToJobs } from '../services/candidate-link-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

type LinkCandidateToJobsVariables = { userId: string; jobIds: string[] };

export function useLinkCandidateToJobs() {
  const { token, locale } = useAssessmentRequestOptions();
  const queryClient = useQueryClient();
  const t = useTranslations('companyPage.assessments.results');

  return useMutation({
    mutationFn: ({ userId, jobIds }: LinkCandidateToJobsVariables) =>
      linkCandidateToJobs(userId, jobIds, { token, locale }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['candidate-link-targets', locale],
        }),
        queryClient.invalidateQueries({ queryKey: ['company-jobs'] }),
        queryClient.invalidateQueries({
          queryKey: [APPLICATION_CANDIDATES_QUERY_KEY, locale],
        }),
      ]);
    },
    onError: (error: Error) =>
      toast.error(getHttpErrorMessage(error) || t('link-job-error')),
  });
}
