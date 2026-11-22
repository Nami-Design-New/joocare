'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import {
  assessmentQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/assessment-queries';
import {
  ASSESSMENT_RESULTS_PAGE_SIZE,
  HTTP_NOT_FOUND,
  MAX_QUERY_RETRIES,
} from '../constants/assessment-results';
import { getAssessmentResults } from '../services/assessment-results-service';
import type { AssessmentResultsFilters } from '../types/assessment-results.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessmentResults(filters: AssessmentResultsFilters) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: assessmentQueryKeys.results(locale, filters),
    enabled: isReady && Boolean(filters.categoryId && filters.assessmentId),
    placeholderData: keepPreviousData,
    retry: (count, error) =>
      getHttpStatusCode(error) !== HTTP_NOT_FOUND && count < MAX_QUERY_RETRIES,
    queryFn: () =>
      getAssessmentResults(filters, ASSESSMENT_RESULTS_PAGE_SIZE, {
        token,
        locale,
      }),
  });
}
