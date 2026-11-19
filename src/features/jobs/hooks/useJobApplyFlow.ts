import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import type {
  ApplyScreeningQuestion,
  ApplySubmission,
} from '../types/job-apply.types';
import type { JobLinkedAssessment } from '../types/jobs.types';

type ApplyDialog = 'login' | 'apply' | 'submitted';

type UseJobApplyFlowOptions = {
  isApplied: boolean;
  screeningQuestions?: ApplyScreeningQuestion[] | null;
  assessment?: JobLinkedAssessment | null;
};

// Apply button flow: login / role gate → apply modal (with or without questions) → result modal.
export function useJobApplyFlow({
  isApplied,
  screeningQuestions,
}: UseJobApplyFlowOptions) {
  const t = useTranslations('jobDetailsPage.toasts');
  const questionsT = useTranslations('jobDetailsPage.apply.questions');
  const { data: session, status } = useSession();
  const [dialog, setDialog] = useState<ApplyDialog | null>(null);
  const [didApply, setDidApply] = useState(false);
  const [submission, setSubmission] = useState<ApplySubmission | null>(null);

  const questions = screeningQuestions ?? [];

  const startApply = () => {
    if (isApplied || didApply) return;
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
    if (screeningQuestions === null) {
      toast.error(questionsT('unavailable-error'));
      return;
    }
    setDialog('apply');
  };

  const handleApplied = () => {
    setDidApply(true);
    setSubmission({
      submittedAt: null,
      assessment: null,
    });
    setDialog('submitted');
  };

  return {
    isEmployer: session?.authRole === 'employer',
    candidateEmail: session?.user?.email ?? '',
    hasApplied: isApplied || didApply,
    questions,
    dialog,
    submission,
    startApply,
    handleApplied,
    closeDialog: () => setDialog(null),
  };
}

export type JobApplyFlow = ReturnType<typeof useJobApplyFlow>;
