'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import CandidateAssessmentModals from '@/features/company-assessments/components/candidate-assessments/CandidateAssessmentModals';
import { useCandidateAssessmentActions } from '@/features/company-assessments/hooks/useCandidateAssessmentActions';
import { CustomPagination } from '@/shared/components/CustomPagination';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import {
  CANDIDATE_AVATAR_FALLBACK,
  MISSING_API_VALUE,
  projectQueryKeys,
} from '../constants/project-queries';
import { useGetProject } from '../hooks/useGetProject';
import type { ProjectCandidate } from '../types/company-projects.types';
import { useGetProjectCandidates } from '../hooks/useGetProjectCandidates';
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
  const [status, setStatus] = useState('');
  const candidatesQuery = useGetProjectCandidates(projectId, status);
  const candidates = useMemo(() => {
    const media = new Map(
      (query.data?.candidates ?? []).map((item) => [item.userId, item]),
    );
    return (candidatesQuery.data ?? EMPTY_CANDIDATES).map((candidate) => ({
      ...candidate,
      image: candidate.image ?? media.get(candidate.userId)?.image ?? null,
      cv: candidate.cv ?? media.get(candidate.userId)?.cv ?? null,
    }));
  }, [candidatesQuery.data, query.data?.candidates]);
  const preview = useProjectCandidates(
    projectId,
    candidates,
    status,
    setStatus,
  );
  const locale = useLocale();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const queryClient = useQueryClient();
  // "+ Share assessment": refresh the rows so the new assessment shows.
  const assessmentActions = useCandidateAssessmentActions({
    onAssigned: () =>
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.projectCandidates(locale, projectId),
      }),
  });
  const toAssessmentCandidate = (candidate: ProjectCandidate) => ({
    id: candidate.userId ?? candidate.id,
    name: candidate.name,
    image: candidate.image || CANDIDATE_AVATAR_FALLBACK,
    location:
      candidate.nationality === MISSING_API_VALUE
        ? null
        : candidate.nationality,
    email: candidate.email,
  });
  const shareAssessment = (candidate: ProjectCandidate) => {
    if (candidate.userId)
      assessmentActions.openAssign(toAssessmentCandidate(candidate));
  };
  // "View all (n)": the candidate's assessments; each opens its result page.
  const viewAssessments = (candidate: ProjectCandidate) =>
    assessmentActions.openList(
      toAssessmentCandidate(candidate),
      candidate.assessments ?? [],
    );
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

      {candidatesQuery.isError && !candidatesQuery.data ? (
        <div
          role="alert"
          className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl bg-card p-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {t('candidates-load-error')}
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => void candidatesQuery.refetch()}
          >
            {t('retry')}
          </Button>
        </div>
      ) : !candidatesQuery.data ? (
        <Skeleton aria-busy="true" className="h-72 rounded-2xl" />
      ) : (
        <ProjectCandidatesTable
          candidates={preview.candidates}
          rowOffset={(preview.page - 1) * preview.pageSize}
          direction={direction}
          onAction={preview.openAction}
          onViewNote={preview.openCandidateNote}
          onDownloadCv={preview.downloadCandidateCv}
          onShareAssessment={shareAssessment}
          onViewAssessments={viewAssessments}
          isFiltered={preview.isFiltered}
        />
      )}

      {preview.filteredCount > preview.pageSize && (
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
        isRemoving={preview.isRemoving}
      />
      <CandidateAssessmentModals actions={assessmentActions} />
    </div>
  );
}
