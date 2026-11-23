import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import {
  RESULT_STATUS_FROM_API,
  RESULT_SUMMARY_ITEMS,
} from '../constants/assessment-results';
import type { AssessmentNote } from '../types/assessment-answers.types';
import type {
  AssessmentListPage,
  AssessmentResultDetails,
  AssessmentResultDetailsApiData,
  AssessmentResultNoteApiItem,
  AssessmentResultRequestOptions,
  AssessmentResultsApiData,
  AssessmentResultsFilters,
  AssessmentResultsList,
  SaveResultNotePayload,
} from '../types/assessment-results.types';
import { readPaginationMeta } from '../utils/pagination';
import { toUtcIsoDate } from '../utils/assessment-results';

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function mapNote(note: AssessmentResultNoteApiItem): AssessmentNote {
  const author = note.admin?.name ?? '';
  return {
    id: String(note.id),
    author,
    initials: getInitials(author),
    role: note.admin?.role_label ?? '',
    createdAt: toUtcIsoDate(note.created_at) ?? note.created_at,
    text: note.note,
    edited: note.is_edited,
  };
}

function mapResultDetails(
  data: AssessmentResultDetailsApiData,
  body: unknown,
  perPage: number,
): AssessmentResultDetails {
  const { summary, result } = data;
  return {
    id: String(result.id),
    candidate: {
      name: data.candidate.name,
      email: data.candidate.email,
      image: data.candidate.image,
      status: RESULT_STATUS_FROM_API[result.status] ?? 'pending',
    },
    scorePercent: summary.score_percent,
    assessmentTitle: data.assessment.name,
    sentAt: toUtcIsoDate(result.sent_on),
    startedAt: toUtcIsoDate(result.started_on),
    finishedAt: toUtcIsoDate(result.finished_on),
    durationSeconds: result.time_taken_seconds ?? 0,
    counts: {
      correct: summary.correct,
      wrong: summary.wrong,
      missing: summary.missing,
    },
    totalQuestions: summary.total_questions,
    notes: data.notes.map(mapNote),
    questions: data.questions.map((question) => {
      const image = question.files[0]?.file;
      return {
        id: String(question.id),
        number: question.number,
        text: question.question,
        multiple: question.type === 'multi_choice',
        yesNo: question.type === 'yes_no',
        options: question.answers.map((answer) => ({
          id: String(answer.id),
          text: answer.answer,
        })),
        correctOptionIds: question.answers
          .filter((answer) => answer.is_correct)
          .map((answer) => String(answer.id)),
        selectedOptionIds: question.answers
          .filter((answer) => answer.is_selected)
          .map((answer) => String(answer.id)),
        points: question.earned_score,
        maxPoints: question.score,
        image: image
          ? { src: image, width: 640, height: 360, description: '' }
          : undefined,
      };
    }),
    questionsPage: {
      total: readPaginationMeta(body, perPage).total,
      perPage,
    },
  };
}

// Assessments of one category for the results filter.
export async function getAssessmentListOptions(
  categoryId: string,
  page: number,
  limitPerPage: number,
  { token, locale }: AssessmentResultRequestOptions,
): Promise<AssessmentListPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(limitPerPage),
    page: String(page),
    category_id: categoryId,
  });
  const { ok, data, message } = await apiFetch<AssessmentListPage['data']>(
    `${getCompanyApiUrl()}/assessments-list?${params.toString()}`,
    { token, locale, cache: 'no-store' },
  );
  if (!ok) throw new Error(message ?? '');
  const body: unknown = data;
  const nextPageUrl =
    body &&
    typeof body === 'object' &&
    'next_page_url' in body &&
    typeof body.next_page_url === 'string'
      ? body.next_page_url
      : null;
  return { data: data?.data ?? [], next_page_url: nextPageUrl };
}

export async function getAssessmentResults(
  filters: AssessmentResultsFilters,
  limitPerPage: number,
  { token, locale }: AssessmentResultRequestOptions,
): Promise<AssessmentResultsList> {
  const params = new URLSearchParams({
    assessment_category_id: filters.categoryId,
    assessment_id: filters.assessmentId,
    limit_per_page: String(limitPerPage),
    page: String(filters.page),
  });
  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.status !== 'all') {
    params.set('status', filters.status);
  }
  // The API rejects max_score without min_score, so a lone max starts from 0.
  if (filters.minScore || filters.maxScore) {
    params.set('min_score', filters.minScore || '0');
  }
  if (filters.maxScore) params.set('max_score', filters.maxScore);
  if (filters.isExternal) params.set('is_external', '1');
  if (filters.projectId !== 'all') params.set('project_id', filters.projectId);

  const { ok, data, message, statusCode } =
    await apiFetch<AssessmentResultsApiData>(
      `${getCompanyApiUrl()}/assessment-results?${params.toString()}`,
      { token, locale, cache: 'no-store' },
    );
  if (!ok || !data?.data) {
    throw createHttpStatusError(statusCode, message ?? undefined);
  }
  const { stats, users } = data.data;
  const meta = readPaginationMeta(data, limitPerPage);

  return {
    rows: users.map((item) => ({
      id: String(item.id),
      name: item.user.name,
      email: item.user.email,
      image: item.user.image,
      cv: item.user.cv ?? null,
      status: RESULT_STATUS_FROM_API[item.status] ?? 'pending',
      date: toUtcIsoDate(item.submitted_at ?? item.started_at),
      score: item.score_percent,
      project: '',
    })),
    summary: RESULT_SUMMARY_ITEMS.map((item) => ({
      key: item.key,
      count: stats[item.stat] ?? 0,
      className: item.className,
    })),
    total: meta.total,
    perPage: meta.perPage,
  };
}

export async function getAssessmentResult(
  resultId: string,
  page: number,
  limitPerPage: number,
  { token, locale }: AssessmentResultRequestOptions,
): Promise<AssessmentResultDetails> {
  const { ok, data, message, statusCode } =
    await apiFetch<AssessmentResultDetailsApiData>(
      `${getCompanyApiUrl()}/assessment-results/${encodeURIComponent(resultId)}?limit_per_page=${limitPerPage}&page=${page}`,
      { token, locale, cache: 'no-store' },
    );
  if (!ok || !data?.data) {
    throw createHttpStatusError(statusCode, message ?? undefined);
  }
  return mapResultDetails(data.data, data, limitPerPage);
}

export async function saveResultNote(
  { resultId, noteId, text }: SaveResultNotePayload,
  { token, locale }: AssessmentResultRequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/assessment-result-notes${noteId ? `/${noteId}` : ''}`,
    {
      method: noteId ? 'PUT' : 'POST',
      token,
      locale,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        noteId
          ? { note: text.trim() }
          : { assessment_result_id: Number(resultId), note: text.trim() },
      ),
    },
  );
  if (!ok) throw new Error(message ?? '');
  return message;
}

export async function deleteResultNote(
  noteId: string,
  { token, locale }: AssessmentResultRequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/assessment-result-notes/${noteId}`,
    { method: 'DELETE', token, locale },
  );
  if (!ok) throw new Error(message ?? '');
  return message;
}
