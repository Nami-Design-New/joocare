'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ASSESSMENT_PAGE_SIZE } from '../constants/assessment-data';
import {
  assessmentQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/assessment-queries';
import { getCategoryAssessments } from '../services/assessments-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

// Assessments of one category for a dropdown (loads more on scroll).
export function useGetCategoryAssessmentOptions(categoryId: string) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  const query = useInfiniteQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: assessmentQueryKeys.assessmentOptions(locale, categoryId),
    initialPageParam: 1,
    enabled: isReady && Boolean(categoryId),
    queryFn: ({ pageParam }) =>
      getCategoryAssessments(categoryId, '', pageParam, ASSESSMENT_PAGE_SIZE, {
        token,
        locale,
      }),
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });

  return {
    ...query,
    assessments: query.data?.pages.flatMap((page) => page.items) ?? [],
  };
}
