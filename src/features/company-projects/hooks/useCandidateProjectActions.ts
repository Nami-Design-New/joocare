'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type {
  CandidateProjectAction,
  ProjectCandidateRef,
} from '../types/company-projects.types';
import type { TCreateProjectSchema } from '../validation/create-project-schema';
import { useAssignCandidatesToProjects } from './useAssignCandidatesToProjects';
import { useCreateProject } from './useCreateProject';

// Candidate name + project count shown by the "linked to project" success modal.
type LinkedToProjects = { name: string; count: number };

// Create a project / add a candidate to projects. Candidates without a real
// `userId` (talent database preview data) keep the preview behaviour.
export function useCandidateProjectActions() {
  const t = useTranslations('companyPage.projects.candidate-projects');
  const [action, setAction] = useState<CandidateProjectAction>(null);
  const [linked, setLinked] = useState<LinkedToProjects | null>(null);
  const createMutation = useCreateProject();
  const assignMutation = useAssignCandidatesToProjects();
  const close = () => setAction(null);

  async function createProject({ name }: TCreateProjectSchema) {
    if (!action || createMutation.isPending) return;
    const { candidate } = action;
    let projectId: string;
    try {
      projectId = await createMutation.mutateAsync(name);
    } catch {
      // useCreateProject shows the error; keep the form open to retry.
      return;
    }
    if (candidate.userId) {
      try {
        await assignMutation.mutateAsync({
          userIds: [candidate.userId],
          projectIds: [projectId],
        });
      } catch {
        // The project exists; the assign hook already showed why the
        // candidate could not be added.
        close();
        return;
      }
    }
    toast.success(t('created-toast', { project: name, name: candidate.name }));
    close();
  }

  async function linkProjects(projectIds: string[]) {
    if (!action || !projectIds.length) return;
    const { candidate } = action;
    if (candidate.userId) {
      // Errors propagate so the modal stays open with the selection kept.
      await assignMutation.mutateAsync({
        userIds: [candidate.userId],
        projectIds,
      });
    }
    setLinked({ name: candidate.name, count: projectIds.length });
    close();
  }

  return {
    action,
    linked,
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
