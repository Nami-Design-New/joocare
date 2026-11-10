'use client';

import { useTranslations } from 'next-intl';
import AlertModal from '@/shared/components/modals/AlertModal';
import type { CompanyProject } from '../../types/company-projects.types';

type ProjectCloseModalProps = {
  project: CompanyProject;
  onClose: () => void;
  onConfirm: (projectId: string) => void;
};

export default function ProjectCloseModal({
  project,
  onClose,
  onConfirm,
}: ProjectCloseModalProps) {
  const t = useTranslations('companyPage.projects');

  return (
    <AlertModal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t('close-project-title')}
      description={t('close-project-description', { name: project.name })}
      confirmLabel={t('confirm-close-project')}
      cancelLabel={t('cancel')}
      onConfirm={() => onConfirm(project.id)}
    />
  );
}
