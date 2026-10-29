'use client';

import { useMemo, useState } from 'react';
import {
  ASSESSMENT_PAGE_SIZE,
  assessmentSeeds,
  categorySeeds,
} from '../constants/assessment-data';

export function useCategoryAssessments(categoryId: string) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [assessments, setAssessments] = useState(assessmentSeeds);
  const category = categorySeeds.find((item) => item.id === categoryId);
  const filtered = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase();
    return assessments.filter(
      (assessment) =>
        assessment.categoryId === categoryId &&
        assessment.title.toLocaleLowerCase().includes(normalized),
    );
  }, [assessments, categoryId, search]);
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / ASSESSMENT_PAGE_SIZE)),
  );

  return {
    category,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    page: currentPage,
    setPage,
    pageSize: ASSESSMENT_PAGE_SIZE,
    total: filtered.length,
    assessments: filtered.slice(
      (currentPage - 1) * ASSESSMENT_PAGE_SIZE,
      currentPage * ASSESSMENT_PAGE_SIZE,
    ),
    togglePaused: (assessmentId: string) => {
      setAssessments((current) =>
        current.map((assessment) =>
          assessment.id === assessmentId
            ? {
                ...assessment,
                pausedAt: assessment.pausedAt ? null : new Date().toISOString(),
              }
            : assessment,
        ),
      );
    },
    deleteAssessment: (assessmentId: string) => {
      setAssessments((current) =>
        current.filter((assessment) => assessment.id !== assessmentId),
      );
    },
  };
}
