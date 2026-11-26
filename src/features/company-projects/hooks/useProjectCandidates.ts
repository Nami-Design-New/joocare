'use client';

import { useMemo, useState } from 'react';
import type {
  CandidateAction,
  ProjectCandidate,
} from '../types/company-projects.types';
import { useDownloadProjectCandidateCv } from './useDownloadProjectCandidateCv';
import { useRemoveProjectCandidate } from './useRemoveProjectCandidate';

const CANDIDATE_PAGE_SIZE = 10;

// Search and paging over the fetched candidates, plus candidate actions.
export function useProjectCandidates(
  projectId: string,
  candidates: ProjectCandidate[],
  status: string,
  onStatusChange: (value: string) => void,
) {
  const removeMutation = useRemoveProjectCandidate(projectId);
  const downloadMutation = useDownloadProjectCandidateCv();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<CandidateAction>(null);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return candidates.filter((candidate) => {
      const searchableText =
        `${candidate.name} ${candidate.email}`.toLocaleLowerCase();
      const matchesSearch = searchableText.includes(normalizedSearch);
      return matchesSearch;
    });
  }, [candidates, search]);

  const visibleCandidates = filteredCandidates.slice(
    (page - 1) * CANDIDATE_PAGE_SIZE,
    page * CANDIDATE_PAGE_SIZE,
  );
  const activeCandidate =
    candidates.find((candidate) => candidate.id === action?.candidateId) ??
    null;

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateStatus = (value: string) => {
    onStatusChange(value);
    setPage(1);
  };

  // Removes every row of the user; resolves only when the API succeeds.
  const removeCandidate = async (candidateId: string) => {
    const userId = candidates.find(
      (candidate) => candidate.id === candidateId,
    )?.userId;
    if (!userId || removeMutation.isPending) return;
    await removeMutation.mutateAsync(userId);
    const remainingCount = filteredCandidates.filter(
      (candidate) => candidate.userId !== userId,
    ).length;
    setPage((current) =>
      Math.min(
        current,
        Math.max(1, Math.ceil(remainingCount / CANDIDATE_PAGE_SIZE)),
      ),
    );
  };

  const openCandidateNote = (candidateId: string) => {
    setAction({ type: 'note', candidateId });
  };

  const downloadCandidateCv = (candidate: ProjectCandidate) => {
    if (candidate.cv && !downloadMutation.isPending)
      downloadMutation.mutate(candidate);
  };

  const closeAction = () => setAction(null);
  const openAction = (nextAction: NonNullable<CandidateAction>) => {
    setAction(nextAction);
  };

  return {
    candidates: visibleCandidates,
    totalCandidates: candidates.length,
    filteredCount: filteredCandidates.length,
    isFiltered: Boolean(search.trim() || status),
    search,
    status,
    page,
    pageSize: CANDIDATE_PAGE_SIZE,
    action,
    activeCandidate,
    openAction,
    closeAction,
    openCandidateNote,
    downloadCandidateCv,
    setPage,
    updateSearch,
    updateStatus,
    removeCandidate,
    isRemoving: removeMutation.isPending,
  };
}
