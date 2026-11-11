'use client';

import Lottie from 'lottie-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import warningAnimation from '../../../../../public/assets/lottie/warning.json';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../../constants';
import type { CandidateAssessment } from '../../types/candidate-assessment.types';
import AssessmentStatusCard from './AssessmentStatusCard';

type AssessmentUnavailableProps = {
  assessment: CandidateAssessment;
};

// The employer paused the assessment.
export default function AssessmentUnavailable({
  assessment,
}: AssessmentUnavailableProps) {
  const t = useTranslations('candidatePage.assessment.status.unavailable');

  return (
    <AssessmentStatusCard
      visual={
        <div aria-hidden className="size-20 sm:size-28">
          <Lottie animationData={warningAnimation} loop autoplay />
        </div>
      }
      title={t('title')}
      description={t.rich('description', {
        company: () => <bdi>{assessment.sentBy}</bdi>,
        title: () => <bdi>{assessment.title}</bdi>,
        email: () => <bdi>{assessment.hiringTeamEmail}</bdi>,
      })}
      actions={
        <>
          <Button
            asChild
            size="pill"
            className="h-12.5 bg-secondary hover:bg-secondary/90 sm:w-69"
          >
            <a href={`mailto:${assessment.hiringTeamEmail}`}>
              {t('email-team')}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="pill"
            className="h-12.5 border-secondary sm:w-69"
          >
            <Link href={CANDIDATE_ASSESSMENT_ROUTES.appliedJobs}>
              {t('close')}
            </Link>
          </Button>
        </>
      }
    />
  );
}
