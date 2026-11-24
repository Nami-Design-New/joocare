'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import type { ProjectCandidate } from '../../types/company-projects.types';

type CandidateRemoveModalProps = {
  candidate: ProjectCandidate;
  projectName: string;
  onClose: () => void;
  onConfirm: (candidateId: string) => Promise<void>;
  isRemoving?: boolean;
};

export default function CandidateRemoveModal({
  candidate,
  projectName,
  onClose,
  onConfirm,
  isRemoving = false,
}: CandidateRemoveModalProps) {
  const t = useTranslations('companyPage.projects');
  // Blocks a second click before `isRemoving` re-renders.
  const inFlight = useRef(false);

  return (
    <DeleteModal
      open
      onOpenChange={(open) => !open && !isRemoving && onClose()}
      title={t('remove-candidate-title')}
      description={t.rich('remove-candidate-description', {
        name: candidate.name,
        project: projectName,
        b: (chunks) => <strong className="font-semibold">{chunks}</strong>,
      })}
      confirmLabel={t('remove')}
      cancelLabel={t('cancel')}
      isLoading={isRemoving}
      onConfirm={() => {
        if (inFlight.current) return;
        inFlight.current = true;
        onConfirm(candidate.id)
          .then(onClose)
          .catch(() => undefined)
          .finally(() => {
            inFlight.current = false;
          });
      }}
    />
  );
}
