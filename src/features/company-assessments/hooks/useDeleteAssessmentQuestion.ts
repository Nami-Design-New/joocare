'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ASSESSMENT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { deleteAssessmentQuestion } from '../services/assessment-questions-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useDeleteAssessmentQuestion() {
  const t = useTranslations('companyPage.assessments.builder');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: (questionId: string) =>
      deleteAssessmentQuestion(questionId, { token, locale }),
    onSuccess: async () => {
      toast.success(t('question-deleted'));
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
