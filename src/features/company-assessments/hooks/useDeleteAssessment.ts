'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ASSESSMENT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { deleteAssessment } from '../services/assessments-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useDeleteAssessment() {
  const t = useTranslations('companyPage.assessments');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: (assessmentId: string) =>
      deleteAssessment(assessmentId, { token, locale }),
    onSuccess: async () => {
      toast.success(t('assessment-deleted'));
      await Promise.all(
        ASSESSMENT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('delete-error'));
    },
  });
}
