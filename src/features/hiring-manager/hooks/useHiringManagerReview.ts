'use client';

import { useState } from 'react';
import { ALL_STATUSES_VALUE } from '@/features/company-projects/constants/shared-review-options';
import type {
  CandidateDecision,
  SharedReviewCandidate,
} from '@/features/company-projects/types/shared-review.types';
import type { TScheduleInterviewsSchema } from '@/features/company-projects/validation/schedule-interviews-schema';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import type {
  HiringManagerInterview,
  HiringManagerReviewAccess,
} from '../types/hiring-manager-review.types';
import { useGetHiringManagerCandidates } from './useGetHiringManagerCandidates';
import { useGetHiringManagerProject } from './useGetHiringManagerProject';
import { useGetHiringManagerShortlist } from './useGetHiringManagerShortlist';
import { useGetHiringManagerSummary } from './useGetHiringManagerSummary';
import { useScheduleHiringManagerInterviews } from './useScheduleHiringManagerInterviews';
import { useUpdateHiringManagerDecision } from './useUpdateHiringManagerDecision';

type FinalDecision = Exclude<CandidateDecision, 'Under review'>;

export function useHiringManagerReview(access: HiringManagerReviewAccess) {
  const [status, setStatus] = useState(ALL_STATUSES_VALUE);
  const [page, setPage] = useState(1);
  const [step, setStep] = useState<'review' | 'schedule' | 'summary'>('review');
  const [cvCandidate, setCvCandidate] = useState<SharedReviewCandidate | null>(
    null,
  );

  const projectQuery = useGetHiringManagerProject(access);
  const candidatesQuery = useGetHiringManagerCandidates(
    access,
    { page, status },
    projectQuery.isSuccess,
  );
  const decisionUpdate = useUpdateHiringManagerDecision(access);
  const scheduleInterviews = useScheduleHiringManagerInterviews(access);
  const shortlistQuery = useGetHiringManagerShortlist(
    access,
    step === 'schedule',
  );
  const showSummary =
    step === 'summary' ||
    (step === 'schedule' &&
      shortlistQuery.isSuccess &&
      !shortlistQuery.isFetching &&
      shortlistQuery.data.length === 0);
  const summaryQuery = useGetHiringManagerSummary(access, showSummary);
  const isUnauthorized = [
    projectQuery.error,
    candidatesQuery.error,
    shortlistQuery.error,
    summaryQuery.error,
    decisionUpdate.error,
    scheduleInterviews.error,
  ].some((error) => getHttpStatusCode(error) === 401);

  function changeStatus(value: string) {
    setStatus(value || ALL_STATUSES_VALUE);
    setPage(1);
  }

  function toggleDecision(candidateId: string, decision: FinalDecision) {
    const candidate = candidatesQuery.data?.candidates.find(
      (item) => item.id === candidateId,
    );
    if (!candidate || decisionUpdate.isPending) return;
    decisionUpdate.mutate({
      projectCandidateId: candidate.id,
      decision: candidate.status === decision ? 'Under review' : decision,
    });
  }

  function goToStep(nextStep: 'review' | 'schedule') {
    setStep(nextStep);
    window.scrollTo({ top: 0 });
  }

  function submitInterviews({ interviews }: TScheduleInterviewsSchema) {
    if (scheduleInterviews.isPending || !shortlistQuery.data) return;

    const candidateUsers = new Map(
      shortlistQuery.data.map(({ id, userId }) => [id, userId]),
    );
    const payload: HiringManagerInterview[] = [];
    for (const { candidateId, date, time, method, note } of interviews) {
      const userId = candidateUsers.get(candidateId);
      if (!userId) return;

      payload.push({
        project_id: Number(access.projectId),
        user_id: Number(userId),
        date,
        time,
        method: method === 'online' ? 'online' : 'face_to_face',
        note: note.trim() || null,
      });
    }

    scheduleInterviews.mutate(payload, {
      onSuccess: () => setStep('summary'),
    });
  }

  return {
    projectQuery,
    candidatesQuery,
    shortlistQuery,
    summaryQuery,
    showSummary,
    step,
    goToStep,
    submitInterviews,
    isSavingDecision: decisionUpdate.isPending,
    isScheduling: scheduleInterviews.isPending,
    isUnauthorized,
    status,
    changeStatus,
    page,
    setPage,
    toggleDecision,
    cvCandidate,
    setCvCandidate,
  };
}
