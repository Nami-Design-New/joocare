'use client';

import { useState } from 'react';
import type {
  AssessmentCandidateSummary,
  CandidateAssessment,
  CandidateAssessmentAction,
} from '../types/candidate-assessment.types';

// Preview only: swap `assign` for the assessment invitation mutation when available.
export function useCandidateAssessmentActions() {
  const [action, setAction] = useState<CandidateAssessmentAction>(null);
  // Candidate the assessment was just sent to (shows the success modal).
  const [assignedName, setAssignedName] = useState<string | null>(null);
  const close = () => setAction(null);

  async function assign() {
    if (!action) return;
    setAssignedName(action.candidate.name);
    close();
  }

  return {
    action,
    assignedName,
    closeAssigned: () => setAssignedName(null),
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
