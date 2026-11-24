'use client';

import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import type { CompanyProject } from '../../types/company-projects.types';

type ProjectDeleteModalProps = {
  project: CompanyProject;
  onClose: () => void;
  onConfirm: (projectId: string) => Promise<void>;
  isDeleting?: boolean;
};

export default function ProjectDeleteModal({
  project,
  onClose,
  onConfirm,
  isDeleting = false,
}: ProjectDeleteModalProps) {
  const t = useTranslations('companyPage.projects');

  return (
    <DeleteModal
      open
      onOpenChange={(open) => !open && !isDeleting && onClose()}
      title={t('delete-project-title')}
      description={t.rich('delete-project-description', {
        name: project.name,
        b: (chunks) => <strong className="font-semibold">{chunks}</strong>,
      })}
      confirmLabel={t('delete')}
      cancelLabel={t('cancel')}
      isLoading={isDeleting}
      onConfirm={() => {
        if (isDeleting) return;
        onConfirm(project.id)
          .then(onClose)
          .catch(() => undefined);
      }}
    />
  );
}
