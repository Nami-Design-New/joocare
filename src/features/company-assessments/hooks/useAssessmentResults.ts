'use client';

import { useMemo, useState } from 'react';
import { ASSESSMENT_SEARCH_DEBOUNCE_MS } from '../constants/assessment-queries';
import {
  ASSESSMENT_RESULTS_HREF,
  candidateLinkTargets,
} from '../constants/assessment-results';
import type {
  AssessmentResultCandidate,
  CandidateLinkKind,
} from '../types/assessment-results.types';
import { useDebouncedValue } from './useDebouncedValue';
import { useGetAssessment } from './useGetAssessment';
import { useGetAssessmentCategoryOptions } from './useGetAssessmentCategoryOptions';
import { useGetAssessmentListOptions } from './useGetAssessmentListOptions';
import { useGetAssessmentResults } from './useGetAssessmentResults';

type Option = { value: string; label: string };

// Keeps the selected value visible when it is not in the loaded options page.
function withSelectedOption(options: Option[], selected: Option | null) {
  if (!selected || options.some((item) => item.value === selected.value)) {
    return options;
  }
  return [selected, ...options];
}

// Keeps `?assessment=` in sync without a server round trip, so Back works.
function replaceAssessmentParam(assessmentId: string) {
  const url = new URL(window.location.href);
  if (assessmentId) url.searchParams.set('assessment', assessmentId);
  else url.searchParams.delete('assessment');
  window.history.replaceState(window.history.state, '', url);
}

export function useAssessmentResults(initialAssessmentId?: string) {
  // `null` means "not changed yet", so the `?assessment=` value still applies.
  const [pickedCategoryId, setPickedCategoryId] = useState<string | null>(null);
  const [pickedAssessmentId, setPickedAssessmentId] = useState<string | null>(
    null,
  );
  const [categorySearch, setCategorySearch] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [project, setProject] = useState('all');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [page, setPage] = useState(1);
  const [inspectedCandidate, setInspectedCandidate] =
    useState<AssessmentResultCandidate | null>(null);
  const [cvCandidate, setCvCandidate] =
    useState<AssessmentResultCandidate | null>(null);

  const initialAssessment = useGetAssessment(
    pickedAssessmentId === null ? (initialAssessmentId ?? null) : null,
  );
  const assessmentId = pickedAssessmentId ?? initialAssessmentId ?? '';
  const categoryId =
    pickedCategoryId ?? initialAssessment.data?.categoryId ?? '';

  const debouncedCategorySearch = useDebouncedValue(
    categorySearch.trim(),
    ASSESSMENT_SEARCH_DEBOUNCE_MS,
  );
  const debouncedSearch = useDebouncedValue(
    search.trim(),
    ASSESSMENT_SEARCH_DEBOUNCE_MS,
  );
  const categories = useGetAssessmentCategoryOptions(debouncedCategorySearch);
  const assessments = useGetAssessmentListOptions(categoryId);
  const results = useGetAssessmentResults({
    categoryId,
    assessmentId,
    search: debouncedSearch,
    status,
    minScore,
    maxScore,
    page,
  });

  const initialCategoryOption =
    pickedCategoryId === null && initialAssessment.data
      ? {
          value: initialAssessment.data.categoryId,
          label: initialAssessment.data.categoryName,
        }
      : null;
  const initialAssessmentOption =
    pickedAssessmentId === null && initialAssessment.data
      ? {
          value: String(initialAssessment.data.id),
          label: initialAssessment.data.configuration.title,
        }
      : null;

  const categoryOptions = withSelectedOption(
    categories.options.map((item) => ({ value: item.id, label: item.name })),
    initialCategoryOption,
  );
  const assessmentOptions = withSelectedOption(
    assessments.options,
    initialAssessmentOption,
  );

  const resetPage = <T>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  };

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

  return {
    categoryId,
    categoryOptions,
    categories,
    setCategorySearch,
    setCategoryId: (value: string) => {
      setPickedCategoryId(value);
      setPickedAssessmentId('');
      setPage(1);
      replaceAssessmentParam('');
    },
    assessmentId,
    assessmentOptions,
    assessments,
    setAssessmentId: (value: string) => {
      setPickedAssessmentId(value);
      setPage(1);
      replaceAssessmentParam(value);
    },
    isLoadingInitialAssessment:
      pickedAssessmentId === null &&
      Boolean(initialAssessmentId) &&
      initialAssessment.isLoading,
    hasSelection: Boolean(categoryId && assessmentId),
    results,
    filters: {
      search,
      setSearch: resetPage(setSearch),
      status,
      setStatus: resetPage(setStatus),
      project,
      setProject,
      minScore,
      setMinScore: resetPage(setMinScore),
      maxScore,
      setMaxScore: resetPage(setMaxScore),
    },
    page,
    setPage,
    getResultHref: (candidate: AssessmentResultCandidate) =>
      candidate.status === 'pending' || candidate.status === 'absent'
        ? null
        : `${ASSESSMENT_RESULTS_HREF}/${assessmentId}/${candidate.id}`,
    inspectedCandidate,
    setInspectedCandidate,
    cvCandidate,
    setCvCandidate,
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
    closeSuccessDialog: () => setSuccessKind(null),
  };
}
