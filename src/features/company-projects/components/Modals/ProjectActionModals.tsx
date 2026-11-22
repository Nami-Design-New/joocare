'use client';

import type {
  CompanyProject,
  ProjectAction,
} from '../../types/company-projects.types';
import ProjectCloseModal from './ProjectCloseModal';
import ProjectDeleteModal from './ProjectDeleteModal';
import ProjectEditNameModal from './ProjectEditNameModal';
import ProjectShareModal from './ProjectShareModal';
import ProjectShareLogModal from './ProjectShareLogModal';

type ProjectActionModalsProps = {
  action: ProjectAction;
  project: CompanyProject | null;
  onClose: () => void;
  onShare: (projectId: string, manager: string) => void;
  onRename: (projectId: string, name: string) => Promise<void>;
  onCloseProject: (projectId: string) => void;
  onDelete: (projectId: string) => Promise<void>;
  isRenaming?: boolean;
  isDeleting?: boolean;
};

export default function ProjectActionModals({
  action,
  project,
  onClose,
  onShare,
  onRename,
  onCloseProject,
  onDelete,
  isRenaming = false,
  isDeleting = false,
}: ProjectActionModalsProps) {
  if (!action || !project) return null;

  switch (action.type) {
    case 'share':
      return (
        <ProjectShareModal
          project={project}
          onClose={onClose}
          onShare={onShare}
        />
      );
    case 'edit':
      return (
        <ProjectEditNameModal
          project={project}
          onClose={onClose}
          onSave={onRename}
          isSaving={isRenaming}
        />
      );
    case 'close':
      return (
        <ProjectCloseModal
          project={project}
          onClose={onClose}
          onConfirm={(projectId) => {
            onCloseProject(projectId);
            onClose();
          }}
        />
      );
    case 'delete':
      return (
        <ProjectDeleteModal
          project={project}
          onClose={onClose}
          onConfirm={onDelete}
          isDeleting={isDeleting}
        />
      );
    case 'log':
      return <ProjectShareLogModal project={project} onClose={onClose} />;
  }
}
