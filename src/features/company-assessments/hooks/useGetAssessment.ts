'use client';

import { useQuery } from '@tanstack/react-query';
import { assessmentQueryKeys } from '../constants/assessment-queries';
import { getAssessment } from '../services/assessments-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessment(assessmentId: string | null) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    queryKey: assessmentQueryKeys.assessment(locale, assessmentId ?? ''),
    enabled: isReady && Boolean(assessmentId),
    queryFn: () => getAssessment(assessmentId ?? '', { token, locale }),
  });
}
