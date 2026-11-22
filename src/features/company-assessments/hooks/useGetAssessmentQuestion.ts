'use client';

import { useQuery } from '@tanstack/react-query';
import {
  assessmentQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/assessment-queries';
import { getAssessmentQuestion } from '../services/assessment-questions-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessmentQuestion(questionId: string | null) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: assessmentQueryKeys.question(locale, questionId ?? ''),
    enabled: isReady && Boolean(questionId),
    queryFn: () => getAssessmentQuestion(questionId ?? '', { token, locale }),
  });
}
