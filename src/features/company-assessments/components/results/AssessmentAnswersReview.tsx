'use client';

import { useTranslations } from 'next-intl';
import { Accordion } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { ANSWER_REVIEW_PAGE_SIZE } from '../../constants/assessment-answers';
import { useAssessmentAnswers } from '../../hooks/useAssessmentAnswers';
import type { AssessmentAnswerQuestion as AnswerQuestion } from '../../types/assessment-answers.types';
import AssessmentAnswerQuestion from './AssessmentAnswerQuestion';

type AssessmentAnswersReviewProps = { questions: AnswerQuestion[] };

export default function AssessmentAnswersReview({
  questions,
}: AssessmentAnswersReviewProps) {
  const t = useTranslations('companyPage.assessments.answers');
  const review = useAssessmentAnswers(questions);

  return (
    <section className="space-y-4" aria-labelledby="answers-review-title">
      <header className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2
            id="answers-review-title"
            className="text-assessment-dark text-lg leading-6 font-semibold"
          >
            {t('review-title')}
          </h2>
          <p className="text-assessment-copy text-[13px] leading-4">
            {t('review-description', {
              page: review.page,
              pages: Math.ceil(questions.length / ANSWER_REVIEW_PAGE_SIZE),
              count: review.visibleQuestions.length,
              total: questions.length,
            })}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={review.toggleAll}
          className="text-assessment-primary h-auto shrink-0 rounded-lg px-3 py-2 text-sm font-semibold"
        >
          {t(review.hasOpenQuestions ? 'collapse-all' : 'expand-all')}
        </Button>
      </header>
      <Accordion
        type="multiple"
        value={review.openIds}
        onValueChange={review.setOpenIds}
        className="space-y-4"
      >
        {review.visibleQuestions.map((question) => (
          <AssessmentAnswerQuestion key={question.id} question={question} />
        ))}
      </Accordion>
      <CustomPagination
        currentPage={review.page}
        totalItems={questions.length}
        pageSize={ANSWER_REVIEW_PAGE_SIZE}
        onPageChange={review.setPage}
        statusPosition="start"
        className="justify-start"
      />
    </section>
  );
}
