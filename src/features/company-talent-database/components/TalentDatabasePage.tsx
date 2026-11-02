'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { TALENT_PAGE_SIZE } from '../constants/talent-filters';
import { useTalentDatabasePreview } from '../hooks/useTalentDatabasePreview';
import TalentSearchForm from './TalentSearchForm';
import TalentResultsHeader from './TalentResultsHeader';
import TalentCandidatesTable from './TalentCandidatesTable';
import TalentMessageDialog from './TalentMessageDialog';

export default function TalentDatabasePage() {
  const t = useTranslations('companyPage.talent-database');
  const preview = useTalentDatabasePreview();
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
            selectedIds={preview.selectedIds}
            pageOffset={(preview.page - 1) * TALENT_PAGE_SIZE}
            onToggle={preview.toggleCandidate}
            onToggleAll={preview.toggleAll}
            onMessage={preview.messageCandidate}
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
