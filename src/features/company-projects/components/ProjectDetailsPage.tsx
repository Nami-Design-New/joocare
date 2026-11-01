'use client';

import { CustomPagination } from '@/shared/components/CustomPagination';
import { useLocale } from 'next-intl';
import { useProjectCandidatesPreview } from '../hooks/useProjectCandidatesPreview';
import CandidateActionModals from './Modals/CandidateActionModals';
import ProjectCandidatesFilters from './ProjectCandidatesFilters';
import ProjectCandidatesTable from './ProjectCandidatesTable';
import ProjectDetailsHeader from './ProjectDetailsHeader';

type ProjectDetailsPageProps = {
  projectId: string;
};

export default function ProjectDetailsPage({
  projectId,
}: ProjectDetailsPageProps) {
  const preview = useProjectCandidatesPreview(projectId);
  const direction = useLocale() === 'ar' ? 'rtl' : 'ltr';
  if (!preview.project) return null;

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <ProjectDetailsHeader
        project={preview.project}
        candidateCount={preview.totalCandidates}
      />

      <ProjectCandidatesFilters
        search={preview.search}
        status={preview.status}
        onSearchChange={preview.updateSearch}
        onStatusChange={preview.updateStatus}
      />

      <ProjectCandidatesTable
        candidates={preview.candidates}
        rowOffset={(preview.page - 1) * preview.pageSize}
        direction={direction}
        onAction={preview.openAction}
        onViewNote={preview.openCandidateNote}
      />

      {preview.filteredCount > 0 && (
        <CustomPagination
          totalItems={preview.filteredCount}
          pageSize={preview.pageSize}
          currentPage={preview.page}
          onPageChange={preview.setPage}
          statusPosition="start"
          className="md:justify-between"
        />
      )}

      <CandidateActionModals
        action={preview.action}
        candidate={preview.activeCandidate}
        projectName={preview.project.name}
        onClose={preview.closeAction}
        onRemove={preview.removeCandidate}
      />
    </div>
  );
}
