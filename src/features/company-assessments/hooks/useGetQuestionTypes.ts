'use client';

import { useQuery } from '@tanstack/react-query';
import { assessmentQueryKeys } from '../constants/assessment-queries';
import { getQuestionTypes } from '../services/assessment-questions-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetQuestionTypes() {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    queryKey: assessmentQueryKeys.questionTypes(locale),
    enabled: isReady,
    staleTime: Infinity,
    queryFn: () => getQuestionTypes({ token, locale }),
  });
}
