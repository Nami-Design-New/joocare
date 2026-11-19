'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../constants';

type AssessmentSubmittedModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AssessmentSubmittedModal({
  open,
  onOpenChange,
}: AssessmentSubmittedModalProps) {
  const t = useTranslations('candidatePage.assessment.submitted');
  return (
    <SuccessModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={t('description-generic')}
      autoCloseMs={false}
      className="flex max-w-175 flex-col items-center gap-0 rounded-3xl p-5 pb-8 text-center sm:p-8 sm:pb-16 [&_[data-slot=dialog-close]]:start-8 [&_[data-slot=dialog-close]]:top-8 [&_[data-slot=dialog-close]]:right-auto"
      visualClassName="size-50 sm:size-75"
      visualWrapperClassName="mt-12 mb-0 sm:mt-15 sm:mb-0"
      headerClassName="gap-0"
      titleClassName="mt-6 leading-[34px] sm:mt-9 sm:text-[28px] md:text-[28px]"
      descriptionClassName="leading-[26px] sm:text-[21px]"
      visual={
        <Image
          src="/assets/candidate-assessment/figma/submitted.png"
          alt=""
          width={300}
          height={300}
          unoptimized
        />
      }
      actionsClassName="w-full"
      primaryAction={{
        label: t('go-to-applied-jobs'),
        href: CANDIDATE_ASSESSMENT_ROUTES.appliedJobs,
        className:
          'h-12.5 flex-[1.4375] bg-assessment-primary hover:bg-assessment-primary/90',
      }}
      secondaryAction={{
        label: t('browse-jobs'),
        href: CANDIDATE_ASSESSMENT_ROUTES.jobs,
        className: 'h-12.5',
      }}
    />
  );
}
