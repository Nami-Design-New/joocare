'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type {
  AssessmentCandidateSummary,
  CandidateAssessment,
  CandidateAssessmentAction,
} from '../types/candidate-assessment.types';

// Preview only: swap `assign` for the assessment invitation mutation when available.
export function useCandidateAssessmentActions() {
  const t = useTranslations('companyPage.assessments.candidate-assessments');
  const [action, setAction] = useState<CandidateAssessmentAction>(null);
  const close = () => setAction(null);

  async function assign() {
    if (!action) return;
    toast.success(t('assigned-toast', { name: action.candidate.name }));
    close();
  }

  return {
    action,
    openList: (
      candidate: AssessmentCandidateSummary,
      assessments: CandidateAssessment[],
    ) => setAction({ type: 'list', candidate, assessments }),
    openAssign: (candidate: AssessmentCandidateSummary) =>
      setAction({ type: 'assign', candidate, assessments: [] }),
    switchToAssign: () =>
      setAction((current) => current && { ...current, type: 'assign' }),
    close,
    assign,
  };
}

export type CandidateAssessmentActions = ReturnType<
  typeof useCandidateAssessmentActions
>;
