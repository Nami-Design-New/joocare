'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { ANSWER_REVIEW_PAGE_SIZE } from '../../constants/assessment-answers';
import { useAssessmentNotes } from '../../hooks/useAssessmentNotes';
import type { CandidateAssessmentPageProps } from '../../types/assessment-answers.types';
import {
  getCandidateAssessmentResult,
  toResultHeaderData,
} from '../../utils/assessment-answers';
import CandidateAssessmentHeader from './CandidateAssessmentHeader';
import CandidateAssessmentNotes from './CandidateAssessmentNotes';
import AssessmentAnswersReview from './AssessmentAnswersReview';

// Preview result page for external invitations; results use AssessmentResultDetailsPage.
export default function CandidateAssessmentPage(
  props: CandidateAssessmentPageProps,
) {
  const t = useTranslations('companyPage.assessments.answers');
  const notes = useAssessmentNotes();
  const [page, setPage] = useState(1);
  const result = getCandidateAssessmentResult(props);
  if (!result)
    return (
      <HttpStatusState
        statusCode={404}
        title={t('not-found')}
        description={t('not-found-description')}
        primaryHref="/company/assessments-results"
        primaryLabel={t('back-to-results')}
      />
    );

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Link
        href={result.backHref}
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-assessment-primary"
      >
        <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t('back-to-results')}
      </Link>
      <CandidateAssessmentHeader result={toResultHeaderData(result)} />
      <CandidateAssessmentNotes notes={notes} />
      <AssessmentAnswersReview
        questions={result.questions.slice(
          (page - 1) * ANSWER_REVIEW_PAGE_SIZE,
          page * ANSWER_REVIEW_PAGE_SIZE,
        )}
        page={page}
        pageSize={ANSWER_REVIEW_PAGE_SIZE}
        totalQuestions={result.questions.length}
        onPageChange={setPage}
      />
    </div>
  );
}
