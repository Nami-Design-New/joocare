'use client';

import { useTranslations } from 'next-intl';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import type { CandidateProjectActions } from '../../hooks/useCandidateProjectActions';
import AddCandidateToProjectModal from './AddCandidateToProjectModal';
import CreateProjectModal from './CreateProjectModal';

type CandidateProjectModalsProps = {
  actions: CandidateProjectActions;
};

// Create project / add to project dialogs + the "linked to project" success modal (Figma 11661:97159).
export default function CandidateProjectModals({
  actions,
}: CandidateProjectModalsProps) {
  const t = useTranslations('companyPage.projects.candidate-projects');
  const { action, linked } = actions;

  return (
    <>
      {action?.type === 'create' ? (
        <CreateProjectModal
          key={action.candidate.id}
          candidate={action.candidate}
          onClose={actions.close}
          onCreate={actions.createProject}
        />
      ) : null}
      {action?.type === 'link' ? (
        <AddCandidateToProjectModal
          key={action.candidate.id}
          candidate={action.candidate}
          projects={actions.projects}
          onClose={actions.close}
          onSubmit={actions.linkProjects}
        />
      ) : null}
      <SuccessModal
        open={linked !== null}
        title={t('linked-success')}
        description={
          linked
            ? t('linked-toast', { name: linked.name, count: linked.count })
            : ''
        }
        onOpenChange={(open) => {
          if (!open) actions.closeLinked();
        }}
      />
    </>
  );
}
