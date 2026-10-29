'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card } from '@/shared/components/ui/card';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { SelectInputField } from '@/shared/components/SelectInputField';
import EmptyDataState from '@/shared/components/EmptyDataState';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { useAssessmentResults } from '../../hooks/useAssessmentResults';
import AssessmentCandidateSummary from '../shared/AssessmentCandidateSummary';
import CandidatePreviewDialog from '../shared/CandidatePreviewDialog';
import ExternalInvitationFilters from '../assessments/ExternalInvitationFilters';
import ExternalInvitationsTable from '../assessments/ExternalInvitationsTable';
import CandidateLinkDialog from './CandidateLinkDialog';

type AssessmentResultsPageProps = { initialAssessmentId?: string };

export default function AssessmentResultsPage({
  initialAssessmentId,
}: AssessmentResultsPageProps) {
  const t = useTranslations('companyPage.assessments.results');
  const results = useAssessmentResults(initialAssessmentId);

  return (
    <div className="mx-auto flex w-full flex-col gap-8 lg:pt-3">
      <header className="space-y-1">
        <h1 className="text-assessment-dark text-[28px] leading-normal font-bold">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-sm leading-5">
          {t('description')}
        </p>
      </header>

      <section className="bg-secondary/5 grid gap-4 rounded-3xl p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(150px,0.9fr)] lg:items-end lg:gap-3">
        <SelectInputField
          id="assessment-result-category"
          label={t('category-label')}
          aria-label={t('category-label')}
          placeholder={t('select-category')}
          options={results.categoryOptions}
          value={results.categoryId}
          onChange={results.setCategoryId}
          className="bg-card h-11 rounded-full border-none text-sm"
        />
        <SelectInputField
          id="assessment-result-assessment"
          label={t('assessment-label')}
          aria-label={t('assessment-label')}
          placeholder={t('select-assessment')}
          options={results.assessmentOptions}
          value={results.assessmentId}
          onChange={results.setAssessmentId}
          disabled={!results.categoryId}
          className="bg-card h-11 rounded-full border-none text-sm"
        />
        <p className="text-assessment-muted self-center text-xs leading-4 lg:pb-2">
          {results.assessmentId ? t('selected-helper') : t('selection-helper')}
        </p>
      </section>

      {!results.selectedAssessment ? (
        <Card className="min-h-80 items-center justify-center gap-3 rounded-2xl border-0 px-6 py-10 text-center shadow-none sm:min-h-90">
          <span className="bg-assessment-info flex size-14 items-center justify-center rounded-full">
            <Search
              aria-hidden="true"
              className="text-assessment-primary size-7"
            />
          </span>
          <h2 className="text-assessment-heading text-base leading-6 font-semibold">
            {t('empty-title')}
          </h2>
          <p className="text-assessment-muted max-w-130 text-xs leading-5">
            {t('empty-description')}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <ExternalInvitationFilters
            search={results.invitations.search}
            onSearch={results.invitations.setSearch}
            status={results.invitations.status}
            onStatus={results.invitations.setStatus}
            project={results.invitations.project}
            onProject={results.invitations.setProject}
            minScore={results.invitations.minScore}
            onMinScore={results.invitations.setMinScore}
            maxScore={results.invitations.maxScore}
            onMaxScore={results.invitations.setMaxScore}
          />
          <AssessmentCandidateSummary summary={results.invitations.summary} />
          <section className="bg-card rounded-xl p-3" aria-label={t('title')}>
            <ExternalInvitationsTable
              rows={results.invitations.rows}
              page={results.invitations.page}
              onInspect={results.invitations.setInspectedCandidate}
              getScoreHref={(candidate) =>
                `/company/assessments-results/${results.assessmentId}/${candidate.id}`
              }
              tableLabel={t('title')}
              onLinkJob={(candidate) =>
                results.openLinkDialog('job', candidate)
              }
              onLinkProject={(candidate) =>
                results.openLinkDialog('project', candidate)
              }
            />
            {results.invitations.rows.length ? (
              <CustomPagination
                currentPage={results.invitations.page}
                totalItems={results.invitations.totalItems}
                pageSize={results.invitations.pageSize}
                onPageChange={results.invitations.setPage}
                className="py-4"
              />
            ) : (
              <EmptyDataState
                title="companyPage.assessments.results.no-results-title"
                description={t('no-results-description')}
              />
            )}
          </section>
        </div>
      )}

      <CandidateLinkDialog
        kind={results.linkKind}
        candidate={results.linkCandidate}
        search={results.linkSearch}
        onSearchChange={results.setLinkSearch}
        targets={results.linkTargets}
        selectedTargetId={results.selectedTargetId}
        onTargetSelect={results.setSelectedTargetId}
        onOpenChange={(open) => {
          if (!open) results.closeLinkDialog();
        }}
        onConfirm={results.confirmLink}
      />
      <SuccessModal
        open={results.successKind !== null}
        title={
          results.successKind === 'job'
            ? t('candidate-linked-to-job')
            : t('candidate-linked-to-project')
        }
        description={t('link-success-description')}
        onOpenChange={(open) => {
          if (!open) results.closeSuccessDialog();
        }}
      />

      <CandidatePreviewDialog
        candidate={results.invitations.inspectedCandidate}
        onOpenChange={(open) => {
          if (!open) results.invitations.setInspectedCandidate(null);
        }}
      />
    </div>
  );
}
