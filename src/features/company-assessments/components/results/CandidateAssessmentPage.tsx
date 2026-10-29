'use client';

import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HttpStatusState from '@/shared/components/HttpStatusState';
import type { CandidateAssessmentPageProps } from '../../types/assessment-answers.types';
import { getCandidateAssessmentResult } from '../../utils/assessment-answers';
import CandidateAssessmentHeader from './CandidateAssessmentHeader';
import CandidateAssessmentNotes from './CandidateAssessmentNotes';
import AssessmentAnswersReview from './AssessmentAnswersReview';

export default function CandidateAssessmentPage(
  props: CandidateAssessmentPageProps,
) {
  const t = useTranslations('companyPage.assessments.answers');
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
        className="text-assessment-primary inline-flex w-fit items-center gap-2 text-sm font-semibold"
      >
        <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t('back-to-results')}
      </Link>
      <CandidateAssessmentHeader result={result} />
      <CandidateAssessmentNotes
        key={`${props.assessmentId}-${props.candidateId}`}
      />
      <AssessmentAnswersReview questions={result.questions} />
    </div>
  );
}
