'use client';

import type { CandidateAssessmentActions } from '../../hooks/useCandidateAssessmentActions';
import AssignAssessmentModal from './AssignAssessmentModal';
import CandidateAssessmentsModal from './CandidateAssessmentsModal';

type CandidateAssessmentModalsProps = {
  actions: CandidateAssessmentActions;
};

export default function CandidateAssessmentModals({
  actions,
}: CandidateAssessmentModalsProps) {
  const { action } = actions;
  if (!action) return null;

  if (action.type === 'list') {
    return (
      <CandidateAssessmentsModal
        candidate={action.candidate}
        assessments={action.assessments}
        onClose={actions.close}
        onAssignAnother={actions.switchToAssign}
      />
    );
  }

  return (
    <AssignAssessmentModal
      key={action.candidate.id}
      candidate={action.candidate}
      onClose={actions.close}
      onAssign={actions.assign}
    />
  );
}
