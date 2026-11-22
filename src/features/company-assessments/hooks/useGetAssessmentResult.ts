'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import { assessmentQueryKeys } from '../constants/assessment-queries';
import {
  RESULT_QUESTIONS_PAGE_SIZE,
  HTTP_NOT_FOUND,
  MAX_QUERY_RETRIES,
} from '../constants/assessment-results';
import { getAssessmentResult } from '../services/assessment-results-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessmentResult(resultId: string, page: number) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    queryKey: assessmentQueryKeys.result(locale, resultId, page),
    enabled: isReady && Boolean(resultId),
    placeholderData: keepPreviousData,
    retry: (count, error) =>
      getHttpStatusCode(error) !== HTTP_NOT_FOUND && count < MAX_QUERY_RETRIES,
    queryFn: () =>
      getAssessmentResult(resultId, page, RESULT_QUESTIONS_PAGE_SIZE, {
        token,
        locale,
      }),
  });
}
