'use client';

import { useTranslations } from 'next-intl';
import { CANDIDATE_ASSESSMENT_ROUTES } from '@/features/candidate-assessment/constants';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { CANDIDATE_APPLICATIONS_HREF, JOBS_HREF } from '../../constants';
import type { ApplySubmission } from '../../types/job-apply.types';
import AssessmentLinkNotice from './AssessmentLinkNotice';

type ApplySubmittedModalProps = {
  submission: ApplySubmission;
  candidateEmail: string;
  onClose: () => void;
};

// Result after applying; jobs with a linked assessment ask the candidate to take it.
export default function ApplySubmittedModal({
  submission,
  candidateEmail,
  onClose,
}: ApplySubmittedModalProps) {
  const t = useTranslations('jobDetailsPage');
  const { assessment } = submission;
  const onOpenChange = (open: boolean) => !open && onClose();

  if (assessment) {
    return (
      <SuccessModal
        open
        onOpenChange={onOpenChange}
        title={t('apply.submitted-with-assessment.title')}
        description={t('apply.submitted-with-assessment.description')}
        className="max-h-[calc(100dvh-2rem)] max-w-175 overflow-y-auto"
        visualWrapperClassName="mt-8 mb-6"
        primaryAction={{
          label: t('apply.submitted-with-assessment.take-now'),
          href: CANDIDATE_ASSESSMENT_ROUTES.take(assessment.id),
        }}
        secondaryAction={{
          label: t('apply.submitted-with-assessment.later'),
          href: CANDIDATE_APPLICATIONS_HREF,
        }}
      >
        <AssessmentLinkNotice
          email={candidateEmail}
          sentAt={submission.submittedAt}
        />
      </SuccessModal>
    );
  }

  return (
    <SuccessModal
      open
      onOpenChange={onOpenChange}
      variant="submitted"
      title={t('success-title')}
      description={t('success-description')}
      primaryAction={{
        label: t('go-to-job-applications'),
        href: CANDIDATE_APPLICATIONS_HREF,
      }}
      secondaryAction={{ label: t('explore-more-jobs'), href: JOBS_HREF }}
    />
  );
}
