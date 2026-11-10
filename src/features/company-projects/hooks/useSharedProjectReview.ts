'use client';

import { useMemo, useState } from 'react';
import { downloadFile } from '@/shared/lib/download-file';
import { projectPreviewData } from '../constants/project-preview-data';
import {
  ALL_STATUSES_VALUE,
  SHARED_REVIEW_PAGE_SIZE,
  sharedReviewCandidatesPreview,
} from '../constants/shared-review-preview-data';
import type { ProjectCandidate } from '../types/company-projects.types';
import type {
  CandidateDecision,
  SharedReviewCandidate,
  SharedReviewStep,
  SharedReviewSummary,
} from '../types/shared-review.types';
import { getCandidateCvFileName } from '../utils/candidate-preview';

export function useSharedProjectReview(projectId: string) {
  const project =
    projectPreviewData.find((item) => item.id === projectId) ?? null;
  const share = project?.shareLogs[0] ?? null;
  const [candidates, setCandidates] = useState(sharedReviewCandidatesPreview);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [step, setStep] = useState<SharedReviewStep>('review');
  const [cvCandidate, setCvCandidate] = useState<SharedReviewCandidate | null>(
    null,
  );
  const [summary, setSummary] = useState<SharedReviewSummary | null>(null);

  const filteredCandidates = useMemo(
    () =>
      candidates.filter((candidate) => !status || candidate.status === status),
    [candidates, status],
  );
  const shortlistedCandidates = useMemo(
    () => candidates.filter((candidate) => candidate.status === 'Shortlist'),
    [candidates],
  );

  const visibleCandidates = filteredCandidates.slice(
    (page - 1) * SHARED_REVIEW_PAGE_SIZE,
    page * SHARED_REVIEW_PAGE_SIZE,
  );

  const updateStatus = (value: string) => {
    setStatus(value === ALL_STATUSES_VALUE ? '' : value);
    setPage(1);
  };

  // Clicking the active decision again moves the candidate back to review.
  const toggleDecision = (
    candidateId: string,
    decision: Exclude<CandidateDecision, 'Under review'>,
  ) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: candidate.status === decision ? 'Under review' : decision,
            }
          : candidate,
      ),
    );
  };

  const submitDecisions = () => {
    setSummary({
      shortlisted: shortlistedCandidates.length,
      rejected: candidates.filter(
        (candidate) => candidate.status === 'Rejected',
      ).length,
    });
  };

  const goToSchedule = () => {
    if (!shortlistedCandidates.length) {
      submitDecisions();
      return;
    }
    setStep('schedule');
    window.scrollTo({ top: 0 });
  };

  const backToReview = () => {
    setStep('review');
    window.scrollTo({ top: 0 });
  };

  const downloadCandidateCv = (candidate: ProjectCandidate) => {
    if (candidate.cv)
      downloadFile(candidate.cv, getCandidateCvFileName(candidate));
  };

  return {
    project,
    share,
    step,
    status,
    page,
    pageSize: SHARED_REVIEW_PAGE_SIZE,
    totalCandidates: candidates.length,
    filteredCount: filteredCandidates.length,
    candidates: visibleCandidates,
    shortlistedCandidates,
    cvCandidate,
    summary,
    setPage,
    updateStatus,
    toggleDecision,
    goToSchedule,
    backToReview,
    submitDecisions,
    openCv: setCvCandidate,
    closeCv: () => setCvCandidate(null),
    downloadCandidateCv,
  };
}
