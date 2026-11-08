'use client';

import { useTranslations } from 'next-intl';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../constants';

type AssessmentSubmittedModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: string;
};

export default function AssessmentSubmittedModal({
  open,
  onOpenChange,
  company,
}: AssessmentSubmittedModalProps) {
  const t = useTranslations('candidatePage.assessment.submitted');

  return (
    <SuccessModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={t.rich('description', {
        company: () => <bdi>{company}</bdi>,
      })}
      primaryAction={{
        label: t('go-to-applied-jobs'),
        href: CANDIDATE_ASSESSMENT_ROUTES.appliedJobs,
      }}
      secondaryAction={{
        label: t('browse-jobs'),
        href: CANDIDATE_ASSESSMENT_ROUTES.jobs,
      }}
    />
  );
}
