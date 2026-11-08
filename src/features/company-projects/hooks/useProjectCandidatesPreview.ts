'use client';

import { useMemo, useState } from 'react';
import { downloadFile } from '@/shared/lib/download-file';
import {
  projectCandidatePreviewData,
  projectPreviewData,
} from '../constants/project-preview-data';
import type {
  CandidateAction,
  ProjectCandidate,
} from '../types/company-projects.types';
import { getCandidateCvFileName } from '../utils/candidate-preview';

const CANDIDATE_PAGE_SIZE = 4;

export function useProjectCandidatesPreview(projectId: string) {
  const project =
    projectPreviewData.find((item) => item.id === projectId) ?? null;
  const [candidates, setCandidates] = useState(projectCandidatePreviewData);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<CandidateAction>(null);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return candidates.filter((candidate) => {
      const searchableText =
        `${candidate.name} ${candidate.email}`.toLocaleLowerCase();
      const matchesSearch = searchableText.includes(normalizedSearch);
      const matchesStatus = !status || candidate.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, status]);

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
    setStatus(value);
    setPage(1);
  };

  const removeCandidate = (candidateId: string) => {
    const remainingCount = filteredCandidates.filter(
      (candidate) => candidate.id !== candidateId,
    ).length;
    setCandidates((current) =>
      current.filter((candidate) => candidate.id !== candidateId),
    );
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
    if (candidate.cv)
      downloadFile(candidate.cv, getCandidateCvFileName(candidate));
  };

  const closeAction = () => setAction(null);
  const openAction = (nextAction: NonNullable<CandidateAction>) => {
    setAction(nextAction);
  };

  return {
    project,
    candidates: visibleCandidates,
    totalCandidates: candidates.length,
    filteredCount: filteredCandidates.length,
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
  };
}
