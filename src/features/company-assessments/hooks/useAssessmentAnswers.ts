'use client';

import { useState } from 'react';
import type { AssessmentAnswerQuestion } from '../types/assessment-answers.types';

// Expand/collapse state for the visible page; new questions start expanded.
export function useAssessmentAnswers(questions: AssessmentAnswerQuestion[]) {
  const [collapsedIds, setCollapsedIds] = useState<string[]>(() =>
    questions
      .filter((question) => question.initiallyCollapsed)
      .map((question) => question.id),
  );
  const visibleIds = questions.map((question) => question.id);
  const openIds = visibleIds.filter((id) => !collapsedIds.includes(id));
  const hasOpenQuestions = openIds.length > 0;

  const setOpenIds = (ids: string[]) =>
    setCollapsedIds((current) => [
      ...current.filter((id) => !visibleIds.includes(id)),
      ...visibleIds.filter((id) => !ids.includes(id)),
    ]);

  return {
    openIds,
    setOpenIds,
    hasOpenQuestions,
    toggleAll: () => setOpenIds(hasOpenQuestions ? [] : visibleIds),
  };
}
