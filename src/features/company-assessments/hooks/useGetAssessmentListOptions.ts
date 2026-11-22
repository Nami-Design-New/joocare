'use client';

import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import {
  ASSESSMENT_LIST_OPTIONS_PAGE_SIZE,
  ASSESSMENT_LIST_QUERY_KEY,
} from '../constants/assessment-results';
import { getAssessmentListOptions } from '../services/assessment-results-service';
import type { AssessmentListPage } from '../types/assessment-results.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

// Assessments for the results filter (assessments-list, loads more on scroll).
export function useGetAssessmentListOptions(categoryId: string) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  const query = useInfiniteLookup({
    endpoint: 'company/assessments-list',
    queryKey: ASSESSMENT_LIST_QUERY_KEY,
    limitPerPage: ASSESSMENT_LIST_OPTIONS_PAGE_SIZE,
    extraParams: { category_id: categoryId },
    enabled: isReady && Boolean(categoryId),
    loadPage: (page) =>
      getAssessmentListOptions(
        categoryId,
        page,
        ASSESSMENT_LIST_OPTIONS_PAGE_SIZE,
        { token, locale },
      ),
  });
  const options =
    query.data?.pages.flatMap((page: AssessmentListPage) =>
      page.data.map((item) => ({ value: String(item.id), label: item.name })),
    ) ?? [];
  return { ...query, options };
}
