'use client';

import { useTranslations } from 'next-intl';
import AlertModal from '@/shared/components/modals/AlertModal';
import type { CompanyProject } from '../../types/company-projects.types';

type ProjectCloseModalProps = {
  project: CompanyProject;
  onClose: () => void;
  onConfirm: (projectId: string) => Promise<void>;
  isSaving?: boolean;
};

export default function ProjectCloseModal({
  project,
  onClose,
  onConfirm,
  isSaving = false,
}: ProjectCloseModalProps) {
  const t = useTranslations('companyPage.projects');

  return (
    <AlertModal
      open
      onOpenChange={(open) => !open && !isSaving && onClose()}
      title={t(
        project.isClosed ? 'reopen-project-title' : 'close-project-title',
      )}
      description={t(
        project.isClosed
          ? 'reopen-project-description'
          : 'close-project-description',
        { name: project.name },
      )}
      confirmLabel={t(
        project.isClosed ? 'reopen-project' : 'confirm-close-project',
      )}
      cancelLabel={t('cancel')}
      isLoading={isSaving}
      onConfirm={() => {
        if (isSaving) return;
        onConfirm(project.id)
          .then(onClose)
          .catch(() => undefined);
      }}
    />
  );
}
