'use client';

import { useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { CustomPagination } from '@/shared/components/CustomPagination';
import HttpStatusState from '@/shared/components/HttpStatusState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { assessmentSeeds } from '../../constants/assessment-data';
import { externalInvitationSummary } from '../../constants/assessment-invitations';
import { useExternalInvitations } from '../../hooks/useExternalInvitations';
import type { ExternalInvitation } from '../../types/assessment-invitation.types';
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
  const format = useFormatter();
  const listing = useExternalInvitations();
  const [inspectedCandidate, setInspectedCandidate] =
    useState<ExternalInvitation | null>(null);
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {externalInvitationSummary.map((stat) => (
            <div
              key={stat.key}
              className="bg-card flex flex-col items-center gap-2 rounded-xl p-5 text-center"
            >
              <p className="text-muted-foreground text-[13px] leading-[normal] font-semibold uppercase">
                {t(stat.key)}
              </p>
              <p
                className={cn(
                  'text-assessment-dark text-[28px] leading-[normal] font-bold',
                  stat.className,
                )}
              >
                {format.number(stat.count)}
              </p>
            </div>
          ))}
        </div>
        <section className="bg-card rounded-xl p-3" aria-label={t('title')}>
          <ExternalInvitationsTable
            rows={listing.rows}
            page={listing.page}
            onInspect={setInspectedCandidate}
          />
          {!listing.rows.length ? (
            <EmptyDataState
              title="companyPage.assessments.invitations.no-results"
              description={t('no-results-description')}
            />
          ) : (
            <CustomPagination
              currentPage={listing.page}
              totalItems={listing.hasFilters ? listing.rows.length : 52}
              pageSize={10}
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
              <span>{t(inspectedCandidate.status)}</span>
              <span>
                {inspectedCandidate.score === null
                  ? '—'
                  : `${format.number(inspectedCandidate.score)}%`}
              </span>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
