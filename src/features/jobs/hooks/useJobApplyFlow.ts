import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { JOB_APPLY_PREVIEW_ENABLED } from '../constants';
import {
  APPLY_PREVIEW_ASSESSMENT,
  APPLY_PREVIEW_SCREENING_QUESTIONS,
} from '../constants/apply-preview-data';
import type {
  ApplyScreeningQuestion,
  ApplySubmission,
} from '../types/job-apply.types';
import type { JobLinkedAssessment } from '../types/jobs.types';

type ApplyDialog = 'login' | 'apply' | 'submitted';

type UseJobApplyFlowOptions = {
  isApplied: boolean;
  screeningQuestions?: ApplyScreeningQuestion[];
  assessment?: JobLinkedAssessment | null;
};

// Apply button flow: login / role gate → apply modal (with or without questions) → result modal.
export function useJobApplyFlow({
  isApplied,
  screeningQuestions,
  assessment,
}: UseJobApplyFlowOptions) {
  const t = useTranslations('jobDetailsPage.toasts');
  const { data: session, status } = useSession();
  const [dialog, setDialog] = useState<ApplyDialog | null>(null);
  const [hasApplied, setHasApplied] = useState(isApplied);
  const [submission, setSubmission] = useState<ApplySubmission | null>(null);

  const questions = screeningQuestions?.length
    ? screeningQuestions
    : JOB_APPLY_PREVIEW_ENABLED
      ? APPLY_PREVIEW_SCREENING_QUESTIONS
      : [];
  const linkedAssessment =
    assessment ?? (JOB_APPLY_PREVIEW_ENABLED ? APPLY_PREVIEW_ASSESSMENT : null);

  const startApply = () => {
    if (status === 'loading') {
      toast.error(t('please-wait'));
      return;
    }
    if (!session?.accessToken) {
      setDialog('login');
      return;
    }
    if (session.authRole !== 'candidate') {
      toast.error(t('only-candidates'));
      return;
    }
    setDialog('apply');
  };

  const handleApplied = () => {
    setHasApplied(true);
    setSubmission({
      submittedAt: new Date(),
      assessment: linkedAssessment
        ? { id: String(linkedAssessment.id), title: linkedAssessment.title }
        : null,
    });
    setDialog('submitted');
  };

  return {
    isEmployer: session?.authRole === 'employer',
    candidateEmail: session?.user?.email ?? '',
    hasApplied,
    questions,
    dialog,
    submission,
    startApply,
    handleApplied,
    closeDialog: () => setDialog(null),
  };
}

export type JobApplyFlow = ReturnType<typeof useJobApplyFlow>;
