'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import CandidateProjectModals from '@/features/company-projects/components/Modals/CandidateProjectModals';
import { useCandidateProjectActions } from '@/features/company-projects/hooks/useCandidateProjectActions';
import CvFileModal from '@/shared/components/modals/CvFileModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { TALENT_PAGE_SIZE } from '../constants/talent-filters';
import { useTalentDatabasePreview } from '../hooks/useTalentDatabasePreview';
import TalentSearchForm from './TalentSearchForm';
import TalentResultsHeader from './TalentResultsHeader';
import TalentCandidatesTable from './TalentCandidatesTable';
import TalentMessageDialog from './TalentMessageDialog';
import { getTalentProfileHref } from '../utils/candidate-profile';
import type { TalentCandidate } from '../types/talent-database.types';

export default function TalentDatabasePage() {
  const t = useTranslations('companyPage.talent-database');
  const preview = useTalentDatabasePreview();
  const projectActions = useCandidateProjectActions();
  const [cvCandidate, setCvCandidate] = useState<TalentCandidate | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preview.showResults) {
      resultsRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [preview.showResults]);

  if (!preview.showResults)
    return (
      <TalentSearchForm
        values={preview.filters}
        onSearch={preview.applyFilters}
      />
    );
  return (
    <div
      ref={resultsRef}
      className="flex min-w-0 scroll-mt-24 flex-col gap-4"
    >
      <TalentResultsHeader
        count={preview.filtered.length}
        selectedCount={preview.selectedCandidates.length}
        search={preview.search}
        onSearchChange={preview.setSearch}
        onSearch={preview.applySearch}
        onMessage={() => preview.setMessageOpen(true)}
      />
      {preview.visible.length ? (
        <>
          <TalentCandidatesTable
            candidates={preview.visible}
            pageOffset={(preview.page - 1) * TALENT_PAGE_SIZE}
            selection={{
              selectedIds: preview.selectedIds,
              onToggle: preview.toggleCandidate,
              onToggleAll: preview.toggleAll,
            }}
            getProfileHref={(candidate) => getTalentProfileHref(candidate.id)}
            onViewCv={setCvCandidate}
            onMessage={(candidate) => preview.messageCandidate(candidate.id)}
            onCreateProject={projectActions.openCreate}
            onLinkProject={projectActions.openLink}
          />
          <CustomPagination
            totalItems={preview.filtered.length}
            pageSize={TALENT_PAGE_SIZE}
            currentPage={preview.page}
            onPageChange={preview.setPage}
            statusPosition="start"
            className="justify-start"
          />
        </>
      ) : (
        <EmptyDataState
          title="companyPage.talent-database.empty-title"
          description={t('empty-description')}
        />
      )}
      {preview.messageOpen && (
        <TalentMessageDialog
          candidates={preview.selectedCandidates}
          onRemove={preview.toggleCandidate}
          onClose={() => preview.setMessageOpen(false)}
          onSend={preview.previewSendMessage}
        />
      )}
      <CandidateProjectModals actions={projectActions} />
      <CvFileModal
        open={!!cvCandidate}
        onOpenChange={(open) => {
          if (!open) setCvCandidate(null);
        }}
        title={cvCandidate?.name ?? ''}
        pdfUrl={cvCandidate?.cv}
      />
      <SuccessModal
        open={preview.sentCount > 0}
        onOpenChange={(open) => {
          if (!open) preview.setSentCount(0);
        }}
        title={t('message-success', { count: preview.sentCount })}
        description=""
        className="w-[calc(100%-2rem)] max-w-175 grid-cols-1 rounded-3xl sm:min-w-0 [&_[data-slot=dialog-title]]:text-[28px]"
        visualClassName="aspect-square h-auto w-75 max-w-full"
        visualWrapperClassName="mt-16 mb-2"
      />
    </div>
  );
}
