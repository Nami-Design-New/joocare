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
  onRename: (projectId: string, name: string) => void;
  onCloseProject: (projectId: string) => void;
  onDelete: (projectId: string) => void;
};

export default function ProjectActionModals({
  action,
  project,
  onClose,
  onShare,
  onRename,
  onCloseProject,
  onDelete,
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
        />
      );
    case 'log':
      return <ProjectShareLogModal project={project} onClose={onClose} />;
  }
}
