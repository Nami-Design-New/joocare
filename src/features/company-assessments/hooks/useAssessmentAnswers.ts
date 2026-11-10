'use client';

import { useState } from 'react';
import { ANSWER_REVIEW_PAGE_SIZE } from '../constants/assessment-answers';
import type { AssessmentAnswerQuestion } from '../types/assessment-answers.types';

export function useAssessmentAnswers(questions: AssessmentAnswerQuestion[]) {
  const [page, setPage] = useState(1);
  const [openIds, setOpenIds] = useState<string[]>(() =>
    questions
      .filter((question) => !question.initiallyCollapsed)
      .map((question) => question.id),
  );
  const visibleQuestions = questions.slice(
    (page - 1) * ANSWER_REVIEW_PAGE_SIZE,
    page * ANSWER_REVIEW_PAGE_SIZE,
  );
  const hasOpenQuestions = visibleQuestions.some((question) =>
    openIds.includes(question.id),
  );

  return {
    page,
    setPage,
    openIds,
    setOpenIds,
    visibleQuestions,
    hasOpenQuestions,
    toggleAll: () =>
      setOpenIds((current) =>
        hasOpenQuestions
          ? current.filter(
              (id) => !visibleQuestions.some((question) => question.id === id),
            )
          : [
              ...new Set([
                ...current,
                ...visibleQuestions.map((question) => question.id),
              ]),
            ],
      ),
  };
}
