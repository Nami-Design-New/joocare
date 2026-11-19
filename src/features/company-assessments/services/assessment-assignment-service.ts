import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  AssignmentCandidatesPage,
  AssignmentRequestOptions,
  AssessmentAssignmentPayload,
} from '../types/assessment-invitation.types';
import {
  assignmentCandidatesPageSchema,
  createAssessmentAssignmentSchema,
} from '../validation/assessment-assignment-schema';
import { buildListParams } from '../utils/pagination';

export async function getAssignmentCandidates(
  search: string,
  page: number,
  limitPerPage: number,
  { token, locale }: AssignmentRequestOptions,
): Promise<AssignmentCandidatesPage> {
  const result = await apiFetch<unknown>(
    `${getCompanyApiUrl()}/users-list?${buildListParams(page, limitPerPage, { search })}`,
    { token, locale, cache: 'no-store' },
  );
  if (!result.ok) throw new Error(result.message || '');
  const parsed = assignmentCandidatesPageSchema.safeParse(result.data);
  if (!parsed.success) throw new Error('');
  return parsed.data;
}

export async function assignAssessment(
  payload: AssessmentAssignmentPayload,
  { token, locale }: AssignmentRequestOptions,
  invalidMessage: string,
) {
  const parsed =
    createAssessmentAssignmentSchema(invalidMessage).safeParse(payload);
  if (!parsed.success) throw new Error(invalidMessage);
  const body = new FormData();
  [...new Set(parsed.data.userIds)].forEach((id) =>
    body.append('user_ids[]', id),
  );
  [...new Set(parsed.data.emails)].forEach((email) =>
    body.append('emails[]', email),
  );
  const result = await apiFetch(
    `${getCompanyApiUrl()}/assign-assessment/${parsed.data.assessmentId}`,
    { method: 'POST', body, token, locale, cache: 'no-store' },
  );
  if (!result.ok) throw new Error(result.message || '');
  return { message: result.message };
}
