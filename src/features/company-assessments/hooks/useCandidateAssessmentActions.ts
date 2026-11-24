'use client';

import { useState } from 'react';
import type {
  AssessmentCandidateSummary,
  CandidateAssessment,
  CandidateAssessmentAction,
} from '../types/candidate-assessment.types';
import type { TAssignAssessmentSchema } from '../validation/assign-assessment-schema';
import { useAssignAssessment } from './useAssignAssessment';

type CandidateAssessmentActionsOptions = {
  /** Runs after the assessment is sent (e.g. to refresh the page's own list). */
  onAssigned?: () => void;
};

// Candidate assessments list + sharing an assessment with one candidate
// (`assign-assessment`, the candidate id is the user id).
export function useCandidateAssessmentActions({
  onAssigned,
}: CandidateAssessmentActionsOptions = {}) {
  const [action, setAction] = useState<CandidateAssessmentAction>(null);
  // Candidate the assessment was just sent to (shows the success modal).
  const [assignedName, setAssignedName] = useState<string | null>(null);
  const close = () => setAction(null);
  const assignment = useAssignAssessment(() => {
    if (action) setAssignedName(action.candidate.name);
    close();
    onAssigned?.();
  });

  function assign({ assessmentId }: TAssignAssessmentSchema) {
    if (!action) return;
    assignment.assign({
      assessmentId,
      userIds: [action.candidate.id],
      emails: [],
    });
  }

  return {
    action,
    assignedName,
    isAssigning: assignment.isPending,
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
