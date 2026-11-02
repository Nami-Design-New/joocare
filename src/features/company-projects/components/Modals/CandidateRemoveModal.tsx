'use client';

import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import type { ProjectCandidate } from '../../types/company-projects.types';

type CandidateRemoveModalProps = {
  candidate: ProjectCandidate;
  projectName: string;
  onClose: () => void;
  onConfirm: (candidateId: string) => void;
};

export default function CandidateRemoveModal({
  candidate,
  projectName,
  onClose,
  onConfirm,
}: CandidateRemoveModalProps) {
  const t = useTranslations('companyPage.projects');

  return (
    <DeleteModal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t('remove-candidate-title')}
      description={t('remove-candidate-description', {
        name: candidate.name,
        project: projectName,
      })}
      confirmLabel={t('remove')}
      cancelLabel={t('cancel')}
      onConfirm={() => onConfirm(candidate.id)}
    />
  );
}
