'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { CustomPagination } from '@/shared/components/CustomPagination';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { assessmentSeeds } from '../../constants/assessment-data';
import { useExternalInvitations } from '../../hooks/useExternalInvitations';
import AssessmentCandidateSummary from '../shared/AssessmentCandidateSummary';
import CandidatePreviewDialog from '../shared/CandidatePreviewDialog';
import AssignAssessmentDialog from '../shared/AssignAssessmentDialog';
import ExternalInvitationFilters from './ExternalInvitationFilters';
import ExternalInvitationsTable from './ExternalInvitationsTable';

type ExternalInvitationsPageProps = {
  categoryId: string;
  assessmentId: string;
};

export default function ExternalInvitationsPage({
  categoryId,
  assessmentId,
}: ExternalInvitationsPageProps) {
  const t = useTranslations('companyPage.assessments.invitations');
  const listing = useExternalInvitations();
  const assessment = assessmentSeeds.find(
    (item) => item.id === assessmentId && item.categoryId === categoryId,
  );
  const statusHref = `/company/assessments/${categoryId}/${assessmentId}/external-invitations`;
  if (!assessment)
    return (
      <HttpStatusState
        statusCode={404}
        title={t('not-found')}
        description={t('not-found')}
        primaryHref={`/company/assessments/${categoryId}`}
        primaryLabel={t('back')}
      />
    );

  return (
    <div className="mx-auto flex w-full flex-col gap-11 lg:pt-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-assessment-dark text-[28px] leading-[normal] font-bold">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-base leading-[normal]">
            {t('subtitle', { assessment: assessment.title })}
          </p>
        </div>
        <Button
          className="bg-assessment-primary h-10 rounded-[20px] px-4 text-base font-semibold"
          disabled={Boolean(assessment.pausedAt)}
          onClick={() => listing.setAssignOpen(true)}
        >
          {t('invite')}
        </Button>
      </header>
      <div className="flex flex-col gap-6">
        <ExternalInvitationFilters
          search={listing.search}
          onSearch={listing.setSearch}
          status={listing.status}
          onStatus={listing.setStatus}
          project={listing.project}
          onProject={listing.setProject}
          minScore={listing.minScore}
          onMinScore={listing.setMinScore}
          maxScore={listing.maxScore}
          onMaxScore={listing.setMaxScore}
        />
        <AssessmentCandidateSummary summary={listing.summary} />
        <section className="bg-card rounded-xl p-3" aria-label={t('title')}>
          <ExternalInvitationsTable
            rows={listing.rows}
            page={listing.page}
            onInspect={listing.setInspectedCandidate}
            getScoreHref={(candidate) => `${statusHref}/${candidate.id}`}
          />
          {!listing.rows.length ? (
            <EmptyDataState
              title="companyPage.assessments.invitations.no-results"
              description={t('no-results-description')}
            />
          ) : (
            <CustomPagination
              currentPage={listing.page}
              totalItems={listing.totalItems}
              pageSize={listing.pageSize}
              onPageChange={listing.setPage}
              className="py-4"
            />
          )}
        </section>
      </div>
      <AssignAssessmentDialog
        open={listing.assignOpen}
        onOpenChange={listing.setAssignOpen}
        assessmentTitle={assessment.title}
        statusHref={statusHref}
      />
      <CandidatePreviewDialog
        candidate={listing.inspectedCandidate}
        onOpenChange={(open) => {
          if (!open) listing.setInspectedCandidate(null);
        }}
      />
    </div>
  );
}
