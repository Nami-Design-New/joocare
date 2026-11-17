'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ASSESSMENT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { saveAssessmentQuestion } from '../services/assessment-questions-service';
import type { SaveQuestionPayload } from '../types/assessment-builder.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useSaveAssessmentQuestion() {
  const t = useTranslations('companyPage.assessments.builder');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: (payload: SaveQuestionPayload) =>
      saveAssessmentQuestion(payload, { token, locale }),
    onSuccess: async (_data, { questionId }) => {
      toast.success(t(questionId ? 'question-updated' : 'question-added'));
      await Promise.all(
        ASSESSMENT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('save-error'));
    },
  });
}
