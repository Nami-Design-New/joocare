'use client';

import type { CandidateProjectActions } from '../../hooks/useCandidateProjectActions';
import AddCandidateToProjectModal from './AddCandidateToProjectModal';
import CreateProjectModal from './CreateProjectModal';

type CandidateProjectModalsProps = {
  actions: CandidateProjectActions;
};

export default function CandidateProjectModals({
  actions,
}: CandidateProjectModalsProps) {
  const { action } = actions;
  if (!action) return null;

  if (action.type === 'create') {
    return (
      <CreateProjectModal
        key={action.candidate.id}
        candidate={action.candidate}
        onClose={actions.close}
        onCreate={actions.createProject}
      />
    );
  }

  return (
    <AddCandidateToProjectModal
      key={action.candidate.id}
      candidate={action.candidate}
      projects={actions.projects}
      onClose={actions.close}
      onSubmit={actions.linkProjects}
    />
  );
}
