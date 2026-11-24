'use client';

import { useLocale, useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import { useGetProject } from '../hooks/useGetProject';
import type { ProjectCandidate } from '../types/company-projects.types';
import { useProjectCandidates } from '../hooks/useProjectCandidates';
import CandidateActionModals from './Modals/CandidateActionModals';
import ProjectCandidatesFilters from './ProjectCandidatesFilters';
import ProjectCandidatesTable from './ProjectCandidatesTable';
import ProjectDetailsHeader from './ProjectDetailsHeader';

const HTTP_NOT_FOUND = 404;
const EMPTY_CANDIDATES: ProjectCandidate[] = [];

type ProjectDetailsPageProps = {
  projectId: string;
};

export default function ProjectDetailsPage({
  projectId,
}: ProjectDetailsPageProps) {
  const t = useTranslations('companyPage.projects');
  const query = useGetProject(projectId);
  const preview = useProjectCandidates(
    query.data?.candidates ?? EMPTY_CANDIDATES,
  );
  const direction = useLocale() === 'ar' ? 'rtl' : 'ltr';
  const project = query.data;

  if (
    query.isError &&
    !project &&
    getHttpStatusCode(query.error) === HTTP_NOT_FOUND
  ) {
    return (
      <HttpStatusState
        statusCode={HTTP_NOT_FOUND}
        title={t('not-found')}
        description={t('not-found-description')}
        primaryHref="/company/projects"
        primaryLabel={t('back-to-projects')}
      />
    );
  }

  if (query.isError && !project) {
    return (
      <div
        role="alert"
        className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl bg-card p-6 text-center"
      >
        <p className="text-sm text-muted-foreground">{t('load-error')}</p>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => void query.refetch()}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div aria-busy="true" className="flex flex-col gap-6">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <ProjectDetailsHeader
        project={project}
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
        onDownloadCv={preview.downloadCandidateCv}
      />

      {preview.filteredCount > 0 && (
        <CustomPagination
          totalItems={preview.filteredCount}
          pageSize={preview.pageSize}
          currentPage={preview.page}
          onPageChange={preview.setPage}
          statusPosition="start"
          tone="strong"
          align="start"
        />
      )}

      <CandidateActionModals
        action={preview.action}
        candidate={preview.activeCandidate}
        projectName={project.name}
        onClose={preview.closeAction}
        onRemove={preview.removeCandidate}
      />
    </div>
  );
}
