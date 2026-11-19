import { apiFetch } from '@/shared/lib/fetch-manager';
import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { createHttpStatusError } from '@/shared/lib/http-error';
import {
  assessmentDetailsSchema,
  assessmentAttemptSchema,
  assessmentAnswerSchema,
} from '../validation/candidate-assessment-schema';
import type {
  AssessmentAnswer,
  AssessmentRequestOptions,
} from '../types/assessment-api.types';

async function requestAssessment(
  id: string,
  suffix: string,
  options: AssessmentRequestOptions,
  answer?: AssessmentAnswer,
) {
  if (!/^\d+$/.test(id)) throw createHttpStatusError(404);
  const result = await apiFetch<unknown>(
    `${getUserApiUrl()}/assessments/${encodeURIComponent(id)}${suffix}`,
    {
      ...options,
      cache: 'no-store',
      method: answer ? 'POST' : 'GET',
      ...(answer
        ? {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessmentAnswerSchema.parse(answer)),
          }
        : {}),
    },
  );
  if (!result.ok)
    throw createHttpStatusError(result.statusCode, result.message ?? undefined);
  return result.data?.data;
}

export async function getCandidateAssessment(
  id: string,
  options: AssessmentRequestOptions,
) {
  const result = assessmentDetailsSchema.safeParse(
    await requestAssessment(id, '', options),
  );
  if (!result.success) throw new Error();
  return result.data;
}

export async function startCandidateAssessment(
  id: string,
  options: AssessmentRequestOptions,
) {
  const result = assessmentAttemptSchema.safeParse(
    await requestAssessment(id, '/start', options),
  );
  if (!result.success) throw new Error();
  return result.data;
}

export async function answerCandidateAssessment(
  id: string,
  answer: AssessmentAnswer,
  options: AssessmentRequestOptions,
) {
  const result = assessmentAttemptSchema.safeParse(
    await requestAssessment(id, '/answer', options, answer),
  );
  if (!result.success) throw new Error();
  return result.data;
}
