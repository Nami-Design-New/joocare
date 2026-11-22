'use client';

import { useTranslations } from 'next-intl';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import { HTTP_NOT_FOUND } from '../../constants/assessment-results';
import { useGetAssessment } from '../../hooks/useGetAssessment';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';
import AssessmentCreatorCard from './AssessmentCreatorCard';
import AssessmentDetailsHeader from './AssessmentDetailsHeader';
import AssessmentQuestionsOverview from './AssessmentQuestionsOverview';
import AssessmentSummary from './AssessmentSummary';

type AssessmentDetailsPageProps = {
  categoryId: string;
  assessmentId: string;
};

export default function AssessmentDetailsPage({
  categoryId,
  assessmentId,
}: AssessmentDetailsPageProps) {
  const t = useTranslations('companyPage.assessments.details');
  const query = useGetAssessment(assessmentId);
  const assessment = query.data;

  if (
    (query.isError &&
      getHttpStatusCode(query.error) === HTTP_NOT_FOUND &&
      !assessment) ||
    (assessment && assessment.categoryId !== categoryId)
  ) {
    return (
      <HttpStatusState
        statusCode={HTTP_NOT_FOUND}
        title={t('not-found')}
        description={t('not-found-description')}
        primaryHref={`/company/assessments/${categoryId}`}
        primaryLabel={t('back-to-assessments')}
      />
    );
  }

  if (query.isError && !assessment) {
    return <AssessmentsErrorState onRetry={() => void query.refetch()} />;
  }

  if (!assessment) {
    return (
      <div aria-busy="true" className="flex flex-col gap-4 lg:mt-1">
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:mt-1">
      <AssessmentDetailsHeader assessment={assessment} />
      <AssessmentSummary assessment={assessment} />
      <AssessmentQuestionsOverview questions={assessment.questions} />
      <AssessmentCreatorCard />
    </div>
  );
}
