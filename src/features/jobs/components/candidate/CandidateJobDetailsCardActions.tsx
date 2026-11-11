'use client';

import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useJobApplyFlow } from '../../hooks/useJobApplyFlow';
import type { ApplyScreeningQuestion } from '../../types/job-apply.types';
import type { JobLinkedAssessment } from '../../types/jobs.types';
import JobApplyDialogs from '../apply/JobApplyDialogs';
import ToggleSavedJobButton from './ToggleSavedJobButton';

type CandidateJobDetailsCardActionsProps = {
  jobId: number;
  jobTitle: string;
  initialIsSaved: boolean;
  isApplied: boolean;
  screeningQuestions?: ApplyScreeningQuestion[];
  assessment?: JobLinkedAssessment | null;
};

export default function CandidateJobDetailsCardActions({
  jobId,
  jobTitle,
  initialIsSaved,
  isApplied,
  screeningQuestions,
  assessment,
}: CandidateJobDetailsCardActionsProps) {
  const t = useTranslations('jobDetailsPage');
  const applyFlow = useJobApplyFlow({
    isApplied,
    screeningQuestions,
    assessment,
  });

  return (
    <>
      <JobApplyDialogs flow={applyFlow} jobId={jobId} jobTitle={jobTitle} />
      <section className="flex items-center gap-4 max-lg:mt-2 max-md:gap-2">
        {!applyFlow.isEmployer ? (
          <>
            <ToggleSavedJobButton
              jobId={jobId}
              initialIsSaved={initialIsSaved}
              variant="icon"
              className="max-md:size-11 max-md:p-3"
            />
            {applyFlow.hasApplied ? (
              <Button
                type="button"
                variant="outline"
                size="pill"
                disabled
                className="flex-1 cursor-not-allowed border border-primary bg-white text-primary hover:bg-transparent max-md:h-11 max-md:px-4 max-md:py-2"
              >
                {t('already-applied')}
              </Button>
            ) : (
              <Button
                onClick={applyFlow.startApply}
                size="pill"
                className="flex flex-1 items-center gap-2 max-md:h-11 max-md:px-4 max-md:py-2"
              >
                {t('apply-now')} <ArrowRight className="rtl:rotate-180" />
              </Button>
            )}
          </>
        ) : null}
      </section>
    </>
  );
}
