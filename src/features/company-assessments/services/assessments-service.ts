import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { API_TO_QUESTION_TYPE } from '../constants/assessment-builder';
import {
  STATIC_ASSESSMENT_ASSOCIATED_JOBS,
  STATIC_ASSESSMENT_EXTERNAL_INVITATIONS,
} from '../constants/assessment-queries';
import type {
  Assessment,
  AssessmentApiItem,
  PaginatedResult,
} from '../types/assessment.types';
import type {
  SaveAssessmentPayload,
  SavedAssessment,
} from '../types/assessment-builder.types';
import { buildListParams, readPaginationMeta } from '../utils/pagination';

type RequestOptions = { token: string; locale: string };

function mapAssessment(item: AssessmentApiItem): Assessment {
  return {
    id: String(item.id),
    categoryId: String(item.assessment_category_id),
    title: item.name,
    description: item.description ?? '',
    createdAt: item.created_at,
    questionCount: item.questions_count,
    durationMinutes: item.time_limit,
    passScore: item.passing_score,
    associatedJobs: STATIC_ASSESSMENT_ASSOCIATED_JOBS,
    externalInvitations: STATIC_ASSESSMENT_EXTERNAL_INVITATIONS,
    pausedAt: null,
  };
}

function mapSavedAssessment(item: AssessmentApiItem): SavedAssessment {
  const questions = (item.questions ?? []).map((question) => ({
    id: String(question.id),
    questionText: question.question,
    type: API_TO_QUESTION_TYPE[question.type] ?? null,
    typeLabel: question.type_label,
    score: Number(question.score),
  }));
  return {
    id: String(item.id),
    categoryId: String(item.assessment_category_id),
    categoryName: item.category?.name ?? '',
    source: item.category?.is_global ? 'joocare' : 'company',
    configuration: {
      title: item.name,
      description: item.description ?? '',
      passScore: String(item.passing_score),
      durationMinutes: String(item.time_limit),
    },
    attemptsCount: item.attempts_count,
    questionCount: item.questions_count,
    questionTypeCounts: {
      'yes-no': item.yes_no_questions_count,
      'single-choice': item.single_choice_questions_count,
      'multiple-choice': item.multi_choice_questions_count,
    },
    questions,
    totalScore: questions.reduce(
      (total, question) => total + question.score,
      0,
    ),
  };
}

export async function getCategoryAssessments(
  categoryId: string,
  search: string,
  page: number,
  limitPerPage: number,
  { token, locale }: RequestOptions,
): Promise<PaginatedResult<Assessment>> {
  const { ok, data, message } = await apiFetch<AssessmentApiItem[]>(
    `${getCompanyApiUrl()}/assessments?${buildListParams(page, limitPerPage, {
      category_id: categoryId,
      search,
    })}`,
    { token, locale },
  );
  if (!ok) throw new Error(message ?? '');
  return {
    items: (data?.data ?? []).map(mapAssessment),
    meta: readPaginationMeta(data, limitPerPage),
  };
}

export async function getAssessment(
  assessmentId: string,
  { token, locale }: RequestOptions,
): Promise<SavedAssessment> {
  const { ok, data, message } = await apiFetch<AssessmentApiItem>(
    `${getCompanyApiUrl()}/assessments/${assessmentId}`,
    { token, locale },
  );
  if (!ok || !data?.data) throw new Error(message ?? '');
  return mapSavedAssessment(data.data);
}

export async function saveAssessment(
  { assessmentId, categoryId, configuration }: SaveAssessmentPayload,
  { token, locale }: RequestOptions,
): Promise<string> {
  const { ok, data, message } = await apiFetch<AssessmentApiItem>(
    `${getCompanyApiUrl()}/assessments${assessmentId ? `/${assessmentId}` : ''}`,
    {
      method: 'POST',
      token,
      locale,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: configuration.title.trim(),
        description: configuration.description.trim(),
        assessment_category_id: Number(categoryId),
        passing_score: Number(configuration.passScore),
        time_limit: Number(configuration.durationMinutes),
        ...(assessmentId ? { _method: 'put' } : {}),
      }),
    },
  );
  const savedId = data?.data?.id ? String(data.data.id) : assessmentId;
  if (!ok || !savedId) throw new Error(message ?? '');
  return savedId;
}

export async function deleteAssessment(
  assessmentId: string,
  { token, locale }: RequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/assessments/${assessmentId}`,
    { method: 'DELETE', token, locale, body: new FormData() },
  );
  if (!ok) throw new Error(message ?? '');
}
