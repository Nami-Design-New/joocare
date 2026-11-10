'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { projectPreviewData } from '../constants/project-preview-data';
import type {
  CandidateProjectAction,
  ProjectCandidateRef,
  ProjectOption,
} from '../types/company-projects.types';
import type { TCreateProjectSchema } from '../validation/create-project-schema';

const projectOptions: ProjectOption[] = projectPreviewData
  .filter((project) => !project.isClosed)
  .map((project) => ({
    id: project.id,
    name: project.name,
    candidateCount:
      project.candidateInitials.length + project.additionalCandidates,
  }));

// Candidate name + project count shown by the "linked to project" success modal.
type LinkedToProjects = { name: string; count: number };

// Preview only: swap the callbacks for project API mutations when available.
export function useCandidateProjectActions() {
  const t = useTranslations('companyPage.projects.candidate-projects');
  const [action, setAction] = useState<CandidateProjectAction>(null);
  const [linked, setLinked] = useState<LinkedToProjects | null>(null);
  const close = () => setAction(null);

  async function createProject({ name }: TCreateProjectSchema) {
    if (!action) return;
    toast.success(
      t('created-toast', { project: name, name: action.candidate.name }),
    );
    close();
  }

  async function linkProjects(projectIds: string[]) {
    if (!action) return;
    setLinked({ name: action.candidate.name, count: projectIds.length });
    close();
  }

  return {
    action,
    linked,
    projects: projectOptions,
    openCreate: (candidate: ProjectCandidateRef) =>
      setAction({ type: 'create', candidate }),
    openLink: (candidate: ProjectCandidateRef) =>
      setAction({ type: 'link', candidate }),
    close,
    closeLinked: () => setLinked(null),
    createProject,
    linkProjects,
  };
}

export type CandidateProjectActions = ReturnType<
  typeof useCandidateProjectActions
>;
