'use client';

import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import { ALL_STATUSES_VALUE } from '../../constants/shared-review-preview-data';
import type {
  CandidateDecision,
  SharedReviewCandidate,
} from '../../types/shared-review.types';
import ReviewCandidateCard from './ReviewCandidateCard';
import SharedReviewTitle from './SharedReviewTitle';

type ReviewCandidatesStepProps = {
  projectName: string;
  sharedBy: string;
  sharedAt: string;
  totalCandidates: number;
  candidates: SharedReviewCandidate[];
  filteredCount: number;
  status: string;
  page: number;
  pageSize: number;
  onStatusChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPreviewCv: (candidate: SharedReviewCandidate) => void;
  onDownloadCv: (candidate: SharedReviewCandidate) => void;
  onDecision: (
    candidateId: string,
    decision: Exclude<CandidateDecision, 'Under review'>,
  ) => void;
  onNext: () => void;
};

export default function ReviewCandidatesStep({
  projectName,
  sharedBy,
  sharedAt,
  totalCandidates,
  candidates,
  filteredCount,
  status,
  page,
  pageSize,
  onStatusChange,
  onPageChange,
  onPreviewCv,
  onDownloadCv,
  onDecision,
  onNext,
}: ReviewCandidatesStepProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  const statusOptions = [
    { value: ALL_STATUSES_VALUE, label: t('all-statuses') },
    { value: 'Under review', label: t('under-review') },
    { value: 'Shortlist', label: t('shortlisted') },
    { value: 'Rejected', label: t('rejected') },
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-11">
      <SharedReviewTitle
        eyebrow={t('project')}
        title={projectName}
        description={t('shared-description', {
          name: sharedBy,
          date: sharedAt,
          count: totalCandidates,
        })}
        action={
          <SelectInputField
            id="shared-review-status-filter"
            aria-label={t('status')}
            options={statusOptions}
            value={status}
            onChange={onStatusChange}
            placeholder={t('status')}
            allowDeselect
            className="h-13 border-border bg-card"
          />
        }
      />

      {candidates.length ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <ReviewCandidateCard
                candidate={candidate}
                onPreviewCv={onPreviewCv}
                onDownloadCv={onDownloadCv}
                onDecision={onDecision}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyDataState
          title={t('empty-title')}
          description={t('empty-description')}
          className="min-h-90 rounded-xl bg-card"
        />
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {filteredCount > 0 ? (
          <CustomPagination
            totalItems={filteredCount}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={onPageChange}
            statusPosition="start"
            className="w-auto md:justify-start"
          />
        ) : (
          <span />
        )}
        <Button
          type="button"
          size="pill"
          onClick={onNext}
          className="h-12.5 self-end px-8 text-sm font-semibold"
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
