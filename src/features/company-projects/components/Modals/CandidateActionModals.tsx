'use client';

import type {
  CandidateAction,
  ProjectCandidate,
} from '../../types/company-projects.types';
import CandidateInterviewModal from './CandidateInterviewModal';
import CandidatePreviewModal from './CandidatePreviewModal';
import CandidateRemoveModal from './CandidateRemoveModal';
import CandidateShareModal from './CandidateShareModal';

type CandidateActionModalsProps = {
  action: CandidateAction;
  candidate: ProjectCandidate | null;
  projectName: string;
  onClose: () => void;
  onRemove: (candidateId: string) => void;
};

export default function CandidateActionModals({
  action,
  candidate,
  projectName,
  onClose,
  onRemove,
}: CandidateActionModalsProps) {
  if (!action || !candidate) return null;

  if (action.type === 'share') {
    return <CandidateShareModal candidate={candidate} onClose={onClose} />;
  }

  if (action.type === 'remove') {
    return (
      <CandidateRemoveModal
        candidate={candidate}
        projectName={projectName}
        onClose={onClose}
        onConfirm={onRemove}
      />
    );
  }

  if (action.type === 'note') {
    return (
      <CandidateInterviewModal
        candidate={candidate}
        projectName={projectName}
        onClose={onClose}
      />
    );
  }

  return (
    <CandidatePreviewModal
      type={action.type}
      candidate={candidate}
      onClose={onClose}
    />
  );
}
