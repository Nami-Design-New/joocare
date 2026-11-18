'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  CATEGORY_PAGE_SIZE,
  assessmentQueryKeys,
} from '../constants/assessment-queries';
import { getAssessmentCategories } from '../services/assessment-categories-service';
import type { AssessmentSource } from '../types/assessment.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessmentCategories(
  source: AssessmentSource,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  const query = useInfiniteQuery({
    queryKey: assessmentQueryKeys.categories(locale, source),
    initialPageParam: 1,
    enabled: isReady && enabled,
    queryFn: ({ pageParam }) =>
      getAssessmentCategories(source, pageParam, CATEGORY_PAGE_SIZE, {
        token,
        locale,
      }),
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });

  return {
    ...query,
    categories: query.data?.pages.flatMap((page) => page.items) ?? [],
    total: query.data?.pages[0]?.meta.total ?? 0,
  };
}
