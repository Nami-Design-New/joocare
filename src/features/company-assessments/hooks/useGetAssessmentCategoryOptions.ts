'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  CATEGORY_OPTIONS_PAGE_SIZE,
  assessmentQueryKeys,
} from '../constants/assessment-queries';
import { getAssessmentCategoryOptions } from '../services/assessment-categories-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

// Joocare + company categories for the filter dropdown (server-side search).
export function useGetAssessmentCategoryOptions(search: string) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  const query = useInfiniteQuery({
    queryKey: assessmentQueryKeys.categoryOptions(locale, search),
    initialPageParam: 1,
    enabled: isReady,
    queryFn: ({ pageParam }) =>
      getAssessmentCategoryOptions(
        search,
        pageParam,
        CATEGORY_OPTIONS_PAGE_SIZE,
        { token, locale },
      ),
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });

  return {
    ...query,
    options: query.data?.pages.flatMap((page) => page.items) ?? [],
  };
}
