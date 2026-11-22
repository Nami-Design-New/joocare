'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ASSESSMENT_PAGE_SIZE } from '../constants/assessment-data';
import {
  assessmentQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/assessment-queries';
import { getCategoryAssessments } from '../services/assessments-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetCategoryAssessments(
  categoryId: string,
  search: string,
  page: number,
) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: assessmentQueryKeys.assessments(locale, categoryId, search, page),
    enabled: isReady,
    placeholderData: keepPreviousData,
    queryFn: () =>
      getCategoryAssessments(categoryId, search, page, ASSESSMENT_PAGE_SIZE, {
        token,
        locale,
      }),
  });
}
