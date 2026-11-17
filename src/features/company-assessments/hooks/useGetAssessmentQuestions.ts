'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ASSESSMENT_QUESTIONS_PAGE_SIZE } from '../constants/assessment-builder';
import { assessmentQueryKeys } from '../constants/assessment-queries';
import { getAssessmentQuestions } from '../services/assessment-questions-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useGetAssessmentQuestions(
  assessmentId: string | null,
  page: number,
) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  return useQuery({
    queryKey: assessmentQueryKeys.questions(locale, assessmentId ?? '', page),
    enabled: isReady && Boolean(assessmentId),
    placeholderData: keepPreviousData,
    queryFn: () =>
      getAssessmentQuestions(
        assessmentId ?? '',
        page,
        ASSESSMENT_QUESTIONS_PAGE_SIZE,
        { token, locale },
      ),
  });
}
