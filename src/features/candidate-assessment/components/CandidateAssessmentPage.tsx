'use client';

import { useTranslations } from 'next-intl';
import { useGetCandidateAssessment } from '../hooks/useGetCandidateAssessment';
import AssessmentCard from './AssessmentCard';
import CandidateAssessmentContent from './CandidateAssessmentContent';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { Button } from '@/shared/components/ui/button';
import {
  getHttpErrorMessage,
  getHttpStatusCode,
} from '@/shared/lib/http-error';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../constants';

export default function CandidateAssessmentPage({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const t = useTranslations('candidatePage.assessment.api');
  const query = useGetCandidateAssessment(assessmentId);
  if (query.isPending)
    return (
      <AssessmentCard>
        <p role="status">{t('loading')}</p>
      </AssessmentCard>
    );
  if (!query.data)
    return (
      <>
        <HttpStatusState
          statusCode={getHttpStatusCode(query.error) ?? 500}
          title={t('load-error')}
          description={getHttpErrorMessage(query.error) ?? t('request-error')}
          primaryHref={CANDIDATE_ASSESSMENT_ROUTES.appliedJobs}
          primaryLabel={t('back')}
        />
        <div className="flex justify-center">
          <Button onClick={() => void query.refetch()}>{t('retry')}</Button>
        </div>
      </>
    );
  return <CandidateAssessmentContent key={assessmentId} details={query.data} />;
}
