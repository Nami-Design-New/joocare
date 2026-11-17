'use client';

import { useState } from 'react';
import { ASSESSMENT_SEARCH_DEBOUNCE_MS } from '../constants/assessment-queries';
import type { AssessmentSource } from '../types/assessment.types';
import { useDebouncedValue } from './useDebouncedValue';
import { useDeleteAssessment } from './useDeleteAssessment';
import { useGetAssessmentCategory } from './useGetAssessmentCategory';
import { useGetCategoryAssessments } from './useGetCategoryAssessments';

export function useCategoryAssessments(
  categoryId: string,
  source: AssessmentSource,
) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(
    search.trim(),
    ASSESSMENT_SEARCH_DEBOUNCE_MS,
  );
  const category = useGetAssessmentCategory(categoryId, source);
  const assessments = useGetCategoryAssessments(
    categoryId,
    debouncedSearch,
    page,
  );
  const deleteMutation = useDeleteAssessment();
  const meta = assessments.data?.meta;

  return {
    category,
    assessments,
    items: assessments.data?.items ?? [],
    total: meta?.total ?? 0,
    pageSize: meta?.perPage ?? 0,
    page,
    setPage,
    search,
    hasSearch: Boolean(debouncedSearch),
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    isDeleting: deleteMutation.isPending,
    deleteAssessment: async (assessmentId: string) => {
      const isLastOnPage = assessments.data?.items.length === 1;
      await deleteMutation.mutateAsync(assessmentId);
      if (isLastOnPage && page > 1) setPage(page - 1);
    },
  };
}
