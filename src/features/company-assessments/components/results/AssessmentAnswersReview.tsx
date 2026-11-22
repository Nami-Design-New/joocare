'use client';

import { useTranslations } from 'next-intl';
import { Accordion } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { cn } from '@/shared/lib/utils';
import { useAssessmentAnswers } from '../../hooks/useAssessmentAnswers';
import type { AssessmentAnswerQuestion as AnswerQuestion } from '../../types/assessment-answers.types';
import AssessmentAnswerQuestion from './AssessmentAnswerQuestion';

type AssessmentAnswersReviewProps = {
  /** Questions of the current page only. */
  questions: AnswerQuestion[];
  page: number;
  pageSize: number;
  totalQuestions: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
};

export default function AssessmentAnswersReview({
  questions,
  page,
  pageSize,
  totalQuestions,
  onPageChange,
  isFetching = false,
}: AssessmentAnswersReviewProps) {
  const t = useTranslations('companyPage.assessments.answers');
  const review = useAssessmentAnswers(questions);

  return (
    <section
      className="space-y-4"
      aria-labelledby="answers-review-title"
      aria-busy={isFetching}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2
            id="answers-review-title"
            className="text-lg leading-6 font-semibold text-assessment-dark"
          >
            {t('review-title')}
          </h2>
          <p className="text-[13px] leading-4 text-assessment-copy">
            {t('review-description', {
              page,
              pages: Math.max(1, Math.ceil(totalQuestions / pageSize)),
              count: questions.length,
              total: totalQuestions,
            })}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={review.toggleAll}
          className="h-auto shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-assessment-primary"
        >
          {t(review.hasOpenQuestions ? 'collapse-all' : 'expand-all')}
        </Button>
      </header>
      <Accordion
        type="multiple"
        value={review.openIds}
        onValueChange={review.setOpenIds}
        className={cn('space-y-4', isFetching && 'opacity-60')}
      >
        {questions.map((question) => (
          <AssessmentAnswerQuestion key={question.id} question={question} />
        ))}
      </Accordion>
      <CustomPagination
        currentPage={page}
        totalItems={totalQuestions}
        pageSize={pageSize}
        onPageChange={onPageChange}
        statusPosition="start"
        className="justify-start"
      />
    </section>
  );
}
