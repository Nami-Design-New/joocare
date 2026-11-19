'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../../constants';
import AssessmentStatusCard from './AssessmentStatusCard';

// The employer paused the assessment.
export default function AssessmentUnavailable() {
  const t = useTranslations('candidatePage.assessment.status.unavailable');
  const api = useTranslations('candidatePage.assessment.api');

  return (
    <AssessmentStatusCard
      visual={
        <div aria-hidden className="size-36 sm:size-50">
          <Image
            src="/assets/candidate-assessment/figma/paused.png"
            alt=""
            width={200}
            height={200}
          />
        </div>
      }
      title={t('title')}
      description={api('unavailable-description')}
      actions={
        <>
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
