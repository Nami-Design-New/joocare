'use client';

import { CandidateProfileApiUser } from '@/features/candidate-profile/types/profile.types';
import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { ScreeningAnswer } from '../types/job-apply.types';
import { createApplyJobSchema } from '../validation/apply-job-schema';

type CandidateCvProfile = {
  cv: string | null;
};

type GetCandidateCvOptions = {
  token: string;
  locale: string;
};

type ApplyToJobOptions = {
  jobId: number;
  cvPath?: string | null;
  answers?: ScreeningAnswer[];
  token: string;
  locale: string;
  invalidAnswers: string;
};

type ApplyToJobResponse = {
  message?: string;
};

function normalizeStoredCvPath(cvPath: string) {
  const trimmedPath = cvPath.trim();

  if (!trimmedPath) {
    return '';
  }

  const path = /^https?:\/\//i.test(trimmedPath)
    ? new URL(trimmedPath).pathname
    : trimmedPath.split(/[?#]/)[0];
  return path.replace(/^\/+/, '').replace(/^storage\//, '');
}

export async function getCandidateCvProfile({
  token,
  locale,
}: GetCandidateCvOptions): Promise<CandidateCvProfile> {
  const result = await apiFetch<CandidateProfileApiUser>(
    `${getUserApiUrl()}/auth/profile`,
    {
      method: 'GET',
      token,
      locale,
      cache: 'no-store',
    },
  );

  if (!result.ok || !result.data?.data) {
    throw new Error(result.message || '');
  }

  return {
    cv: result.data.data.cv ?? null,
  };
}

export async function applyToJobService({
  jobId,
  cvPath,
  answers,
  token,
  locale,
  invalidAnswers,
}: ApplyToJobOptions): Promise<ApplyToJobResponse> {
  const parsed = createApplyJobSchema({ invalidAnswers }).safeParse({
    job_id: jobId,
    cv: cvPath ? normalizeStoredCvPath(cvPath) : undefined,
    answers: (answers ?? [])
      .filter((answer) => answer.selected.length > 0)
      .map((answer) => ({
        question_id: Number(answer.questionId),
        answer_ids: answer.selected.map(Number),
      })),
  });
  if (!parsed.success) throw new Error(invalidAnswers);

  const result = await apiFetch<ApplyToJobResponse>(`${getUserApiUrl()}/jobs`, {
    method: 'POST',
    token,
    locale,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
    cache: 'no-store',
  });

  if (!result.ok) {
    throw new Error(result.message || '');
  }

  return { message: result.message ?? undefined };
}
