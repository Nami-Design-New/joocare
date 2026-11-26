'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAssignCandidatesToProjects } from '@/features/company-projects/hooks/useAssignCandidatesToProjects';
import { ASSESSMENT_SEARCH_DEBOUNCE_MS } from '../constants/assessment-queries';
import type {
  AssessmentResultCandidate,
  CandidateLinkKind,
} from '../types/assessment-results.types';
import { useDebouncedValue } from './useDebouncedValue';
import { useGetCandidateLinkTargets } from './useGetCandidateLinkTargets';
import { useGetCandidateLinkResult } from './useGetCandidateLinkResult';
import { useLinkCandidateToJobs } from './useLinkCandidateToJobs';

export function useCandidateResultLink(assessmentId: string) {
  const [linkKind, setLinkKind] = useState<CandidateLinkKind | null>(null);
  const [linkCandidate, setLinkCandidate] =
    useState<AssessmentResultCandidate | null>(null);
  const [linkSearch, setLinkSearch] = useState('');
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [successKind, setSuccessKind] = useState<CandidateLinkKind | null>(
    null,
  );
  const debouncedSearch = useDebouncedValue(
    linkSearch.trim(),
    ASSESSMENT_SEARCH_DEBOUNCE_MS,
  );
  const userId = linkCandidate?.userId ?? '';
  const targets = useGetCandidateLinkTargets(userId, linkKind, debouncedSearch);
  const candidateResult = useGetCandidateLinkResult(assessmentId, userId);
  const assign = useAssignCandidatesToProjects();
  const linkJobs = useLinkCandidateToJobs();
  const isLinking = assign.isPending || linkJobs.isPending;
  const { data: session } = useSession();

  function closeLinkDialog() {
    if (isLinking) return;
    setLinkKind(null);
    setLinkCandidate(null);
    setLinkSearch('');
    setSelectedTargetIds([]);
  }

  function openLinkDialog(
    kind: CandidateLinkKind,
    candidate: AssessmentResultCandidate,
  ) {
    if (!candidate.userId || candidate.status === 'invitation_pending') return;
    setLinkKind(kind);
    setLinkCandidate(candidate);
    setLinkSearch('');
    setSelectedTargetIds([]);
  }

  async function confirmLink() {
    if (
      !linkKind ||
      !userId ||
      isLinking ||
      !candidateResult.isSuccess ||
      targets.isFetching ||
      linkSearch.trim() !== debouncedSearch ||
      !selectedTargetIds.length
    )
      return;
    try {
      if (linkKind === 'job') {
        await linkJobs.mutateAsync({ userId, jobIds: selectedTargetIds });
      } else {
        await assign.mutateAsync({
          userIds: [userId],
          projectIds: selectedTargetIds,
        });
      }
      void targets.refetch();
      setSuccessKind(linkKind);
      setLinkKind(null);
      setLinkCandidate(null);
      setLinkSearch('');
      setSelectedTargetIds([]);
    } catch {
      // The mutation reports the error. Keep the selection so it can be retried.
    }
  }

  return {
    linkKind,
    linkCandidate,
    linkSearch,
    setLinkSearch,
    linkTargets: targets.targets,
    linkTargetsQuery: targets,
    candidateResult,
    recruiterName: session?.user?.name ?? '-',
    selectedTargetIds,
    toggleTarget: (id: string) => {
      if (isLinking) return;
      setSelectedTargetIds((selected) =>
        selected.includes(id)
          ? selected.filter((targetId) => targetId !== id)
          : [...selected, id],
      );
    },
    successKind,
    openLinkDialog,
    closeLinkDialog,
    confirmLink,
    isLinking,
    isSearchingTargets: linkSearch.trim() !== debouncedSearch,
    closeSuccessDialog: () => setSuccessKind(null),
  };
}
