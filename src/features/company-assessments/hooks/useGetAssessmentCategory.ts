'use client';

import { useQuery } from '@tanstack/react-query';
import { assessmentQueryKeys } from '../constants/assessment-queries';
import { getAssessmentCategory } from '../services/assessment-categories-service';
import type { AssessmentSource } from '../types/assessment.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessmentCategory(
  categoryId: string | null,
  source: AssessmentSource,
) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    queryKey: [
      ...assessmentQueryKeys.category(locale, categoryId ?? ''),
      source,
    ],
    enabled: isReady && Boolean(categoryId),
    queryFn: () =>
      getAssessmentCategory(categoryId ?? '', source, { token, locale }),
  });
}
