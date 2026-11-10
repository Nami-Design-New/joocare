'use client';

import { useState } from 'react';
import type { MessageRecipient } from '@/features/company-talent-database/types/talent-database.types';
import type { PipelineCandidate } from '../types/job-candidates.types';
import { useDownloadCandidateCv } from './useDownloadCandidateCv';
import useGetApplicationsCandidates from './useGetApplicationsCandidates';
import { usePipelineFilters } from './usePipelineFilters';

export function usePipelineCandidates(jobId: number) {
  const filterState = usePipelineFilters();
  const hasFilters = filterState.chips.length > 0;
  const query = useGetApplicationsCandidates({
    jobId,
    page: filterState.page,
    filters: filterState.filters,
  });
  // The unfiltered total for "12 of 57 Candidates".
  const allQuery = useGetApplicationsCandidates({
    jobId,
    page: 1,
    filters: {},
    enabled: hasFilters,
  });
  const download = useDownloadCandidateCv();
  const [selected, setSelected] = useState<MessageRecipient[]>([]);
  const [starOverrides, setStarOverrides] = useState<Record<string, boolean>>(
    {},
  );
  const [messageOpen, setMessageOpen] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [cvCandidate, setCvCandidate] = useState<PipelineCandidate | null>(
    null,
  );

  const candidates = query.data?.candidates ?? [];
  const total = query.data?.total ?? 0;
  const selectedIds = selected.map((candidate) => candidate.id);
  const toRecipient = ({ id, name }: PipelineCandidate) => ({ id, name });

  function toggleCandidate(id: string) {
    setSelected((current) => {
      if (current.some((candidate) => candidate.id === id)) {
        return current.filter((candidate) => candidate.id !== id);
      }
      const candidate = candidates.find((item) => item.id === id);
      return candidate ? [...current, toRecipient(candidate)] : current;
    });
  }

  function toggleAll() {
    const pageIds = candidates.map((candidate) => candidate.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelected((current) =>
      allSelected
        ? current.filter((candidate) => !pageIds.includes(candidate.id))
        : [
            ...current,
            ...candidates
              .filter((candidate) => !selectedIds.includes(candidate.id))
              .map(toRecipient),
          ],
    );
  }

  async function previewSendMessage() {
    // Preview only: replace with the messaging mutation when the API exists.
    setSentCount(selected.length);
    setMessageOpen(false);
    setSelected([]);
  }

  return {
    ...filterState,
    hasFilters,
    candidates,
    total,
    allTotal: hasFilters ? (allQuery.data?.total ?? total) : total,
    pageSize: query.data?.perPage,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    selected,
    selectedIds,
    toggleCandidate,
    toggleAll,
    isStarred: (candidate: PipelineCandidate) =>
      starOverrides[candidate.id] ?? candidate.isStarred,
    // Local until the star endpoint exists.
    toggleStar: (candidate: PipelineCandidate) =>
      setStarOverrides((current) => ({
        ...current,
        [candidate.id]: !(current[candidate.id] ?? candidate.isStarred),
      })),
    messageOpen,
    setMessageOpen,
    sentCount,
    setSentCount,
    previewSendMessage,
    cvCandidate,
    setCvCandidate,
    downloadCv: (candidate: PipelineCandidate) => {
      if (!candidate.cvUrl) return;
      download.mutate({
        applicationId: candidate.id,
        name: candidate.name,
        cvUrl: candidate.cvUrl,
      });
    },
    downloadingId: download.isPending
      ? download.variables?.applicationId
      : undefined,
  };
}
