'use client';

import { useMemo, useState } from 'react';
import { candidateLinkTargets } from '../constants/assessment-results';
import type {
  AssessmentResultCandidate,
  CandidateLinkKind,
} from '../types/assessment-results.types';
import { useExternalInvitations } from './useExternalInvitations';

export function useAssessmentResults() {
  const invitations = useExternalInvitations();
  const [categoryId, setCategoryId] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [linkKind, setLinkKind] = useState<CandidateLinkKind | null>(null);
  const [linkCandidate, setLinkCandidate] =
    useState<AssessmentResultCandidate | null>(null);
  const [linkSearch, setLinkSearch] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [successKind, setSuccessKind] = useState<CandidateLinkKind | null>(
    null,
  );

  const linkTargets = useMemo(() => {
    if (!linkKind) return [];
    return candidateLinkTargets[linkKind].filter((target) =>
      `${target.name} ${target.organization} ${target.location}`
        .toLocaleLowerCase()
        .includes(linkSearch.trim().toLocaleLowerCase()),
    );
  }, [linkKind, linkSearch]);

  const openLinkDialog = (
    kind: CandidateLinkKind,
    candidate: AssessmentResultCandidate,
  ) => {
    setLinkKind(kind);
    setLinkCandidate(candidate);
    setLinkSearch('');
    setSelectedTargetId(candidateLinkTargets[kind][0]?.id ?? '');
  };

  const closeLinkDialog = () => {
    setLinkKind(null);
    setLinkCandidate(null);
    setLinkSearch('');
    setSelectedTargetId('');
  };

  const confirmLink = () => {
    if (!linkKind || !linkCandidate || !selectedTargetId) return;
    const hasMatchingTarget = candidateLinkTargets[linkKind].some(
      (target) => target.id === selectedTargetId,
    );
    if (!hasMatchingTarget) return;

    setSuccessKind(linkKind);
    closeLinkDialog();
  };

  const closeSuccessDialog = () => setSuccessKind(null);

  return {
    invitations,
    categoryId,
    setCategoryId: (value: string) => {
      setCategoryId(value);
      setAssessmentId('');
      invitations.setPage(1);
    },
    assessmentId,
    setAssessmentId,
    linkKind,
    linkCandidate,
    linkSearch,
    setLinkSearch,
    linkTargets,
    selectedTargetId,
    setSelectedTargetId,
    successKind,
    openLinkDialog,
    closeLinkDialog,
    confirmLink,
    closeSuccessDialog,
  };
}
