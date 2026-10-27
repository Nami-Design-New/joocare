'use client';

import { useFormatter, useTranslations } from 'next-intl';
import HttpStatusState from '@/shared/components/HttpStatusState';
import {
  assessmentSeeds,
  categorySeeds,
} from '../../constants/assessment-data';
import { assessmentDetailSeeds } from '../../constants/assessment-detail-data';
import AssessmentCreatorCard from './AssessmentCreatorCard';
import AssessmentDetailsHeader from './AssessmentDetailsHeader';
import AssessmentPausedNotice from './AssessmentPausedNotice';
import AssessmentQuestionsOverview from './AssessmentQuestionsOverview';
import AssessmentSummary from './AssessmentSummary';

export default function AssessmentDetailsPage({
  categoryId,
  assessmentId,
}: {
  categoryId: string;
  assessmentId: string;
}) {
  const t = useTranslations('companyPage.assessments.details');
  const format = useFormatter();
  const assessment = assessmentSeeds.find(
    (item) => item.id === assessmentId && item.categoryId === categoryId,
  );
  const category = categorySeeds.find((item) => item.id === categoryId);
  const detail =
    assessmentDetailSeeds.find((item) => item.assessmentId === assessmentId) ??
    assessmentDetailSeeds[0];

  if (!assessment || !category || !detail) {
    return (
      <HttpStatusState
        statusCode={404}
        title={t('not-found')}
        description={t('not-found-description')}
        primaryHref={`/company/assessments/${categoryId}`}
        primaryLabel={t('back-to-assessments')}
      />
    );
  }

  const isPaused = Boolean(assessment.pausedAt);
  const pausedDate = assessment.pausedAt
    ? format.dateTime(new Date(assessment.pausedAt), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '';

  return (
    <div className="flex flex-col gap-4 lg:mt-1">
      <AssessmentDetailsHeader
        assessment={assessment}
        isPaused={isPaused}
        showActions={category.source === 'company'}
      />
      {isPaused ? (
        <AssessmentPausedNotice
          date={pausedDate}
          candidateCount={detail.pausedCandidateCount}
        />
      ) : null}
      <AssessmentSummary assessment={assessment} detail={detail} />
      <AssessmentQuestionsOverview questions={detail.questions} />
      <AssessmentCreatorCard categoryId={categoryId} creator={detail.creator} />
    </div>
  );
}
