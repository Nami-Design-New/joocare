'use client';

import { useTranslations } from 'next-intl';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import type { CandidateAssessmentActions } from '../../hooks/useCandidateAssessmentActions';
import AssignAssessmentModal from './AssignAssessmentModal';
import CandidateAssessmentsModal from './CandidateAssessmentsModal';

type CandidateAssessmentModalsProps = {
  actions: CandidateAssessmentActions;
};

// Candidate assessments list / assign dialogs + the "assessment sent" success modal.
export default function CandidateAssessmentModals({
  actions,
}: CandidateAssessmentModalsProps) {
  const t = useTranslations('companyPage.assessments.candidate-assessments');
  const { action, assignedName } = actions;

  return (
    <>
      {action?.type === 'list' ? (
        <CandidateAssessmentsModal
          candidate={action.candidate}
          assessments={action.assessments}
          onClose={actions.close}
          onAssignAnother={actions.switchToAssign}
        />
      ) : null}
      {action?.type === 'assign' ? (
        <AssignAssessmentModal
          key={action.candidate.id}
          candidate={action.candidate}
          onClose={actions.close}
          onAssign={actions.assign}
        />
      ) : null}
      {/* Same success modal as "Message sent to (n) candidates successfully". */}
      <SuccessModal
        open={assignedName !== null}
        onOpenChange={(open) => {
          if (!open) actions.closeAssigned();
        }}
        title={t('assigned-success', { name: assignedName ?? '' })}
        description=""
        className="w-[calc(100%-2rem)] max-w-175 grid-cols-1 rounded-3xl sm:min-w-0 [&_[data-slot=dialog-title]]:text-[28px]"
        visualClassName="aspect-square h-auto w-75 max-w-full"
        visualWrapperClassName="mt-16 mb-2"
      />
    </>
  );
}
