'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ASSESSMENT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { saveAssessment } from '../services/assessments-service';
import type { SaveAssessmentPayload } from '../types/assessment-builder.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

// Step 1 of the builder: creates the assessment, or updates it after going back.
export function useSaveAssessment() {
  const t = useTranslations('companyPage.assessments.builder');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: (payload: SaveAssessmentPayload) =>
      saveAssessment(payload, { token, locale }),
    onSuccess: async () => {
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
