'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import {
  HTTP_NOT_FOUND,
  RESULT_QUESTIONS_PAGE_SIZE,
} from '../../constants/assessment-results';
import { useAssessmentResultNotes } from '../../hooks/useAssessmentResultNotes';
import { useGetAssessmentResult } from '../../hooks/useGetAssessmentResult';
import { getAssessmentResultsHref } from '../../utils/assessment-results';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';
import AssessmentAnswersReview from './AssessmentAnswersReview';
import CandidateAssessmentHeader from './CandidateAssessmentHeader';
import CandidateAssessmentNotes from './CandidateAssessmentNotes';

type AssessmentResultDetailsPageProps = {
  assessmentId: string;
  resultId: string;
  /** Back goes to the external invitations view when opened from it. */
  isExternal?: boolean;
};

export default function AssessmentResultDetailsPage({
  assessmentId,
  resultId,
  isExternal = false,
}: AssessmentResultDetailsPageProps) {
  const t = useTranslations('companyPage.assessments.answers');
  const [page, setPage] = useState(1);
  const query = useGetAssessmentResult(resultId, page);
  const result = query.data;
  const notes = useAssessmentResultNotes(resultId, result?.notes ?? []);
  const backHref = getAssessmentResultsHref(assessmentId, {
    external: isExternal,
  });

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-assessment-primary"
      >
        <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t('back-to-results')}
      </Link>
      {query.isError &&
      !result &&
      getHttpStatusCode(query.error) === HTTP_NOT_FOUND ? (
        <HttpStatusState
          statusCode={HTTP_NOT_FOUND}
          title={t('not-found')}
          description={t('not-found-description')}
          primaryHref={backHref}
          primaryLabel={t('back-to-results')}
        />
      ) : query.isError && !result ? (
        <AssessmentsErrorState onRetry={() => void query.refetch()} />
      ) : !result ? (
        <div aria-busy="true" className="flex flex-col gap-6">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : (
        <>
          <CandidateAssessmentHeader result={result} />
          <CandidateAssessmentNotes notes={notes} />
          <AssessmentAnswersReview
            questions={result.questions}
            page={page}
            pageSize={RESULT_QUESTIONS_PAGE_SIZE}
            totalQuestions={result.questionsPage.total || result.totalQuestions}
            onPageChange={setPage}
            isFetching={query.isPlaceholderData}
          />
        </>
      )}
    </div>
  );
}
