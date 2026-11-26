'use client';

import { useState } from 'react';
import { useSendCompanyBulkMessage } from '@/features/chat/hooks/useSendCompanyBulkMessage';
import type {
  MessageRecipient,
  TalentMessageValues,
} from '@/features/company-talent-database/types/talent-database.types';
import type { PipelineCandidate } from '../types/job-candidates.types';
import { useDownloadCandidateCv } from './useDownloadCandidateCv';
import { useGetPinnedCandidateIds } from '@/shared/hooks/useGetPinnedCandidateIds';
import { useToggleCandidatePin } from '@/shared/hooks/useToggleCandidatePin';
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
  const [selected, setSelected] = useState<
    (MessageRecipient & { userId: string })[]
  >([]);
  const bulkMessage = useSendCompanyBulkMessage();
  // Stars are the company's pinned candidates (by user id).
  const pinnedIds = useGetPinnedCandidateIds();
  const togglePin = useToggleCandidatePin();
  const [messageOpen, setMessageOpen] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [cvCandidate, setCvCandidate] = useState<PipelineCandidate | null>(
    null,
  );

  const candidates = query.data?.candidates ?? [];
  const total = query.data?.total ?? 0;
  const selectedIds = selected.map((candidate) => candidate.id);
  const toRecipient = ({ id, name, userId }: PipelineCandidate) => ({
    id,
    name,
    userId,
  });

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

  async function sendMessage({ message }: TalentMessageValues) {
    if (bulkMessage.isPending || !selected.length) return;
    try {
      const { sentCount } = await bulkMessage.mutateAsync({
        userIds: [...new Set(selected.map((candidate) => candidate.userId))],
        message,
      });
      setSentCount(sentCount);
      setMessageOpen(false);
      setSelected([]);
    } catch {
      // The mutation shows the error and the dialog keeps its draft to retry.
    }
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
      pinnedIds.data?.includes(candidate.userId) ?? candidate.isStarred,
    toggleStar: (candidate: PipelineCandidate) =>
      togglePin.toggle(candidate.userId),
    messageOpen,
    setMessageOpen,
    sentCount,
    setSentCount,
    sendMessage,
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
