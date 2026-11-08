'use client';

import CvFileModal from '@/shared/components/modals/CvFileModal';
import type {
  CandidateAction,
  ProjectCandidate,
} from '../../types/company-projects.types';
import CandidateInterviewModal from './CandidateInterviewModal';
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

  switch (action.type) {
    case 'share':
      return <CandidateShareModal candidate={candidate} onClose={onClose} />;
    case 'remove':
      return (
        <CandidateRemoveModal
          candidate={candidate}
          projectName={projectName}
          onClose={onClose}
          onConfirm={onRemove}
        />
      );
    case 'note':
      return (
        <CandidateInterviewModal
          candidate={candidate}
          projectName={projectName}
          onClose={onClose}
        />
      );
    case 'view-cv':
      return (
        <CvFileModal
          open
          onOpenChange={(open) => !open && onClose()}
          title={candidate.name}
          pdfUrl={candidate.cv}
        />
      );
  }
}
