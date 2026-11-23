'use client';

import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import {
  HTTP_NOT_FOUND,
  RESULT_STATUS_FILTERS,
} from '../../constants/assessment-results';
import type { useAssessmentResults } from '../../hooks/useAssessmentResults';
import ExternalInvitationFilters from '../assessments/ExternalInvitationFilters';
import ExternalInvitationsTable from '../assessments/ExternalInvitationsTable';
import AssessmentCandidateSummary from '../shared/AssessmentCandidateSummary';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';

type AssessmentResultsListProps = {
  results: ReturnType<typeof useAssessmentResults>;
};

export default function AssessmentResultsList({
  results,
}: AssessmentResultsListProps) {
  const t = useTranslations('companyPage.assessments.results');
  const { filters } = results;
  const query = results.results;
  const data = query.data;

  return (
    <div className="flex flex-col gap-6">
      <ExternalInvitationFilters
        statuses={RESULT_STATUS_FILTERS}
        search={filters.search}
        onSearch={filters.setSearch}
        status={filters.status}
        onStatus={filters.setStatus}
        project={filters.project}
        onProject={filters.setProject}
        projectOptions={filters.projectOptions}
        hasMoreProjects={filters.hasMoreProjects}
        isLoadingMoreProjects={filters.isLoadingMoreProjects}
        onLoadMoreProjects={filters.loadMoreProjects}
        minScore={filters.minScore}
        onMinScore={filters.setMinScore}
        maxScore={filters.maxScore}
        onMaxScore={filters.setMaxScore}
      />
      {query.isError &&
      !data &&
      getHttpStatusCode(query.error) === HTTP_NOT_FOUND ? (
        <EmptyDataState
          title="companyPage.assessments.results.no-results-title"
          description={t('assessment-not-in-category')}
        />
      ) : query.isError && !data ? (
        <AssessmentsErrorState onRetry={() => void query.refetch()} />
      ) : !data ? (
        <div aria-busy="true" className="flex flex-col gap-6">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      ) : (
        <>
          <AssessmentCandidateSummary summary={data.summary} />
          <section
            className="rounded-xl bg-card p-3"
            aria-label={t('title')}
            aria-busy={query.isFetching}
          >
            <ExternalInvitationsTable
              rows={data.rows}
              page={results.page}
              pageSize={data.perPage}
              onInspect={results.setInspectedCandidate}
              onViewCv={results.setCvCandidate}
              getScoreHref={results.getResultHref}
              tableLabel={t('title')}
              onLinkJob={(candidate) =>
                results.openLinkDialog('job', candidate)
              }
              onLinkProject={(candidate) =>
                results.openLinkDialog('project', candidate)
              }
            />
            {data.rows.length ? (
              <CustomPagination
                currentPage={results.page}
                totalItems={data.total}
                pageSize={data.perPage}
                onPageChange={results.setPage}
                className="py-4"
              />
            ) : (
              <EmptyDataState
                title="companyPage.assessments.results.no-results-title"
                description={t('no-results-description')}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
