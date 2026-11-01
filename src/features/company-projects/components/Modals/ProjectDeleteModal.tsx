'use client';

import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import type { CompanyProject } from '../../types/company-projects.types';

type ProjectDeleteModalProps = {
  project: CompanyProject;
  onClose: () => void;
  onConfirm: (projectId: string) => void;
};

export default function ProjectDeleteModal({
  project,
  onClose,
  onConfirm,
}: ProjectDeleteModalProps) {
  const t = useTranslations('companyPage.projects');

  return (
    <DeleteModal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t('delete-project-title')}
      description={t('delete-project-description', { name: project.name })}
      confirmLabel={t('delete')}
      cancelLabel={t('cancel')}
      onConfirm={() => onConfirm(project.id)}
    />
  );
}
