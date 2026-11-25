'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { Skeleton } from '@/shared/components/ui/skeleton';
import CandidateProjectModals from '@/features/company-projects/components/Modals/CandidateProjectModals';
import { useCandidateProjectActions } from '@/features/company-projects/hooks/useCandidateProjectActions';
import { getCandidateProfileHref } from '@/features/company-projects/utils/candidate-profile-href';
import CvFileModal from '@/shared/components/modals/CvFileModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import {
  TALENT_PAGE_SIZE,
  TALENT_SKELETON_ROWS,
} from '../constants/talent-filters';
import { useTalentDatabase } from '../hooks/useTalentDatabase';
import TalentSearchForm from './TalentSearchForm';
import TalentResultsHeader from './TalentResultsHeader';
import TalentCandidatesTable from './TalentCandidatesTable';
import TalentMessageDialog from './TalentMessageDialog';
import type { TalentCandidate } from '../types/talent-database.types';

// Search rows are real users (`id` is the user id), so projects get a real assignee.
const toProjectCandidate = ({ id, name }: TalentCandidate) => ({
  id,
  name,
  userId: id,
});

export default function TalentDatabasePage() {
  const t = useTranslations('companyPage.talent-database');
  const talent = useTalentDatabase();
  const projectActions = useCandidateProjectActions();
  const [cvCandidate, setCvCandidate] = useState<TalentCandidate | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (talent.showResults) {
      resultsRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [talent.showResults]);

  if (!talent.showResults)
    return (
      <TalentSearchForm
        values={talent.filters}
        onSearch={talent.applyFilters}
      />
    );

  if (talent.isError) {
    return (
      <RouteErrorFallback
        error={talent.error ?? new Error(t('error-description'))}
        reset={talent.retry}
        title={t('error-title')}
        description={t('error-description')}
        retryLabel={t('retry')}
      />
    );
  }

  const pageSize = talent.pageSize ?? TALENT_PAGE_SIZE;
  const renderResults = () => {
    if (talent.isLoading) {
      return (
        <div className="flex flex-col gap-2 rounded-2xl bg-card p-3">
          {Array.from({ length: TALENT_SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} className="h-[92px] rounded-lg" />
          ))}
        </div>
      );
    }
    if (!talent.candidates.length) {
      return (
        <EmptyDataState
          title="companyPage.talent-database.empty-title"
          description={t('empty-description')}
        />
      );
    }
    return (
      <>
        <TalentCandidatesTable
          candidates={talent.candidates}
          onTogglePin={talent.togglePin}
          pageOffset={(talent.page - 1) * pageSize}
          selection={{
            selectedIds: talent.selectedIds,
            onToggle: talent.toggleCandidate,
            onToggleAll: talent.toggleAll,
          }}
          getProfileHref={(candidate) => getCandidateProfileHref(candidate.id)}
          onViewCv={setCvCandidate}
          onMessage={talent.messageCandidate}
          onCreateProject={(candidate) =>
            projectActions.openCreate(toProjectCandidate(candidate))
          }
          onLinkProject={(candidate) =>
            projectActions.openLink(toProjectCandidate(candidate))
          }
        />
        {talent.total > pageSize && (
          <CustomPagination
            totalItems={talent.total}
            pageSize={pageSize}
            currentPage={talent.page}
            onPageChange={talent.setPage}
            statusPosition="start"
            className="justify-start"
          />
        )}
      </>
    );
  };

  return (
    <div ref={resultsRef} className="flex min-w-0 scroll-mt-24 flex-col gap-4">
      <TalentResultsHeader
        count={talent.total}
        selectedCount={talent.selected.length}
        search={talent.search}
        onSearchChange={talent.setSearch}
        onSearch={talent.applySearch}
        onMessage={() => talent.setMessageOpen(true)}
      />
      {renderResults()}
      {talent.messageOpen && (
        <TalentMessageDialog
          candidates={talent.selected}
          onRemove={talent.toggleCandidate}
          onClose={() => talent.setMessageOpen(false)}
          onSend={talent.sendMessage}
        />
      )}
      <CandidateProjectModals actions={projectActions} />
      <CvFileModal
        open={!!cvCandidate}
        onOpenChange={(open) => {
          if (!open) setCvCandidate(null);
        }}
        title={cvCandidate?.name ?? ''}
        pdfUrl={cvCandidate?.cv ?? undefined}
      />
      <SuccessModal
        open={talent.sentCount > 0}
        onOpenChange={(open) => {
          if (!open) talent.setSentCount(0);
        }}
        title={t('message-success', { count: talent.sentCount })}
        description=""
        className="w-[calc(100%-2rem)] max-w-175 grid-cols-1 rounded-3xl sm:min-w-0 [&_[data-slot=dialog-title]]:text-2xl sm:[&_[data-slot=dialog-title]]:text-[28px]"
        visualClassName="aspect-square h-auto w-75 max-w-full"
        visualWrapperClassName="mt-16 mb-2"
      />
    </div>
  );
}
