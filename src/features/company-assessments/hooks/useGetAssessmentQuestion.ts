'use client';

import { useQuery } from '@tanstack/react-query';
import { assessmentQueryKeys } from '../constants/assessment-queries';
import { getAssessmentQuestion } from '../services/assessment-questions-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessmentQuestion(questionId: string | null) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    queryKey: assessmentQueryKeys.question(locale, questionId ?? ''),
    enabled: isReady && Boolean(questionId),
    queryFn: () => getAssessmentQuestion(questionId ?? '', { token, locale }),
  });
}
