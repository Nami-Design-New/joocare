import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import {
  API_TO_QUESTION_TYPE,
  QUESTION_TYPE_TO_API,
  YES_NO_ANSWERS,
  createEmptyOptions,
} from '../constants/assessment-builder';
import type { PaginatedResult } from '../types/assessment.types';
import type {
  AssessmentQuestionApiItem,
  BuilderQuestion,
  QuestionTypeApiItem,
  QuestionTypeOption,
  SaveQuestionPayload,
} from '../types/assessment-builder.types';
import { buildListParams, readPaginationMeta } from '../utils/pagination';

type RequestOptions = { token: string; locale: string };

function mapQuestion(item: AssessmentQuestionApiItem): BuilderQuestion {
  const type = API_TO_QUESTION_TYPE[item.type] ?? 'single-choice';
  const answers = item.answers ?? [];
  const file = item.files?.[0];
  const isYesNo = type === 'yes-no';
  return {
    id: String(item.id),
    type,
    score: String(item.score),
    questionText: item.question,
    options: isYesNo
      ? createEmptyOptions()
      : answers.map((answer) => ({
          id: String(answer.id),
          text: answer.answer,
        })),
    correctAnswers: answers
      .filter((answer) => answer.is_correct)
      .map((answer) =>
        isYesNo ? answer.answer.trim().toLowerCase() : String(answer.id),
      ),
    attachmentEnabled: Boolean(file),
    attachment: null,
    existingAttachment: file ? { id: file.id, url: file.file } : null,
  };
}

function buildQuestionFormData({
  questionId,
  assessmentId,
  values,
  deleteFileIds,
}: SaveQuestionPayload) {
  const body = new FormData();
  body.append('assessment_id', assessmentId);
  body.append('type', QUESTION_TYPE_TO_API[values.type]);
  body.append('score', values.score);
  body.append('question', values.questionText.trim());

  const answers =
    values.type === 'yes-no'
      ? YES_NO_ANSWERS.map((answer) => ({
          answer,
          isCorrect: values.correctAnswers.includes(answer),
        }))
      : values.options.map((option) => ({
          answer: option.text.trim(),
          isCorrect: values.correctAnswers.includes(option.id),
        }));
  answers.forEach((answer, index) => {
    body.append(`answers[${index}][answer]`, answer.answer);
    body.append(`answers[${index}][is_correct]`, answer.isCorrect ? '1' : '0');
  });

  const newFile = values.attachmentEnabled ? values.attachment : null;
  const keepsExistingFile =
    values.attachmentEnabled && Boolean(values.existingAttachment) && !newFile;
  body.append('has_file', newFile || keepsExistingFile ? '1' : '0');
  if (newFile) body.append('files[]', newFile);
  deleteFileIds.forEach((fileId) =>
    body.append('delete_file_ids[]', String(fileId)),
  );
  if (questionId) body.append('_method', 'put');
  return body;
}

export async function getQuestionTypes({
  token,
  locale,
}: RequestOptions): Promise<QuestionTypeOption[]> {
  const { ok, data, message } = await apiFetch<QuestionTypeApiItem[]>(
    `${getCompanyApiUrl()}/questions/types`,
    { token, locale },
  );
  if (!ok) throw new Error(message ?? '');
  return (data?.data ?? []).flatMap((item) => {
    const value = API_TO_QUESTION_TYPE[item.value];
    return value ? [{ value, label: item.label }] : [];
  });
}

export async function getAssessmentQuestions(
  assessmentId: string,
  page: number,
  limitPerPage: number,
  { token, locale }: RequestOptions,
): Promise<PaginatedResult<BuilderQuestion>> {
  const { ok, data, message } = await apiFetch<AssessmentQuestionApiItem[]>(
    `${getCompanyApiUrl()}/questions?${buildListParams(page, limitPerPage, {
      assessment_id: assessmentId,
    })}`,
    { token, locale },
  );
  if (!ok) throw new Error(message ?? '');
  return {
    items: (data?.data ?? []).map(mapQuestion),
    meta: readPaginationMeta(data, limitPerPage),
  };
}

export async function getAssessmentQuestion(
  questionId: string,
  { token, locale }: RequestOptions,
): Promise<BuilderQuestion> {
  const { ok, data, message } = await apiFetch<AssessmentQuestionApiItem>(
    `${getCompanyApiUrl()}/questions/${questionId}`,
    { token, locale },
  );
  if (!ok || !data?.data) throw new Error(message ?? '');
  return mapQuestion(data.data);
}

export async function saveAssessmentQuestion(
  payload: SaveQuestionPayload,
  { token, locale }: RequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/questions${payload.questionId ? `/${payload.questionId}` : ''}`,
    {
      method: 'POST',
      token,
      locale,
      body: buildQuestionFormData(payload),
    },
  );
  if (!ok) throw new Error(message ?? '');
}

export async function deleteAssessmentQuestion(
  questionId: string,
  { token, locale }: RequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/questions/${questionId}`,
    { method: 'DELETE', token, locale, body: new FormData() },
  );
  if (!ok) throw new Error(message ?? '');
}
