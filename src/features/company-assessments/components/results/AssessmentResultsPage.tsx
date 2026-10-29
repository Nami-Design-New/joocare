'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Card } from '@/shared/components/ui/card';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { SelectInputField } from '@/shared/components/SelectInputField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { externalInvitationSummary } from '../../constants/assessment-invitations';
import {
  assessmentResultAssessments,
  assessmentResultCategories,
} from '../../constants/assessment-results';
import { useAssessmentResults } from '../../hooks/useAssessmentResults';
import type { AssessmentResultCandidate } from '../../types/assessment-results.types';
import ExternalInvitationFilters from '../assessments/ExternalInvitationFilters';
import ExternalInvitationsTable from '../assessments/ExternalInvitationsTable';
import CandidateLinkDialog from './CandidateLinkDialog';
import CandidateLinkedSuccessDialog from './CandidateLinkedSuccessDialog';

export default function AssessmentResultsPage() {
  const t = useTranslations('companyPage.assessments.results');
  const format = useFormatter();
  const results = useAssessmentResults();
  const [inspectedCandidate, setInspectedCandidate] =
    useState<AssessmentResultCandidate | null>(null);
  const selectedAssessment = assessmentResultAssessments.find(
    (assessment) => assessment.id === results.assessmentId,
  );
  const assessmentOptions = assessmentResultAssessments
    .filter((assessment) => assessment.categoryId === results.categoryId)
    .map((assessment) => ({
      value: assessment.id,
      label: assessment.name,
    }));

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
          options={assessmentResultCategories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={results.categoryId}
          onChange={results.setCategoryId}
          className="bg-card h-11 rounded-full border-none text-sm"
        />
        <SelectInputField
          id="assessment-result-assessment"
          label={t('assessment-label')}
          aria-label={t('assessment-label')}
          placeholder={t('select-assessment')}
          options={assessmentOptions}
          value={results.assessmentId}
          onChange={results.setAssessmentId}
          disabled={!results.categoryId}
          className="bg-card h-11 rounded-full border-none text-sm"
        />
        <p className="text-assessment-muted self-center text-xs leading-4 lg:pb-2">
          {results.assessmentId ? t('selected-helper') : t('selection-helper')}
        </p>
      </section>

      {!selectedAssessment ? (
        <Card className="min-h-[320px] items-center justify-center gap-3 rounded-2xl border-0 px-6 py-10 text-center shadow-none sm:min-h-[360px]">
          <span className="bg-assessment-info flex size-14 items-center justify-center rounded-full">
            <Search
              aria-hidden="true"
              className="text-assessment-primary size-7"
            />
          </span>
          <h2 className="text-assessment-heading text-base leading-6 font-semibold">
            {t('empty-title')}
          </h2>
          <p className="text-assessment-muted max-w-[520px] text-xs leading-5">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {externalInvitationSummary.map((stat) => (
              <Card
                key={stat.key}
                className="items-center gap-2 rounded-xl border-0 p-5 text-center shadow-none"
              >
                <p className="text-muted-foreground text-[13px] leading-normal font-semibold uppercase">
                  {t(`summary.${stat.key}`)}
                </p>
                <p
                  className={cn(
                    'text-assessment-dark text-[28px] leading-normal font-bold',
                    stat.className,
                  )}
                >
                  {format.number(stat.count)}
                </p>
              </Card>
            ))}
          </div>
          <section className="bg-card rounded-xl p-3" aria-label={t('title')}>
            <ExternalInvitationsTable
              rows={results.invitations.rows}
              page={results.invitations.page}
              onInspect={setInspectedCandidate}
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
                totalItems={
                  results.invitations.hasFilters
                    ? results.invitations.rows.length
                    : 52
                }
                pageSize={10}
                onPageChange={results.invitations.setPage}
                className="py-4"
              />
            ) : null}
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
      <CandidateLinkedSuccessDialog
        kind={results.successKind}
        onOpenChange={(open) => {
          if (!open) results.closeSuccessDialog();
        }}
      />

      <Dialog
        open={Boolean(inspectedCandidate)}
        onOpenChange={(open) => {
          if (!open) setInspectedCandidate(null);
        }}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogTitle>{inspectedCandidate?.name}</DialogTitle>
          <DialogDescription>{inspectedCandidate?.email}</DialogDescription>
          {inspectedCandidate ? (
            <div className="flex justify-between text-sm">
              <span>{t(`status.${inspectedCandidate.status}`)}</span>
              <span>
                {inspectedCandidate.score === null
                  ? t('no-score')
                  : `${format.number(inspectedCandidate.score)}%`}
              </span>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
