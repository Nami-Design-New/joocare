import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  QuestionTemplate,
  QuestionTemplateHint,
} from '../types/jobs.types';

type RequestOptions = { token: string; locale: string };

// Short labels shown as chips under "Question Templates".
export async function getQuestionTemplateHints(
  jobId: number | string,
  { token, locale }: RequestOptions,
): Promise<QuestionTemplateHint[]> {
  const params = new URLSearchParams({ job_id: String(jobId) });
  const { ok, data, message } = await apiFetch<QuestionTemplateHint[]>(
    `${getCompanyApiUrl()}/question-templates-hints?${params.toString()}`,
    { token, locale, cache: 'no-store' },
  );
  if (!ok) throw new Error(message ?? '');
  return data?.data ?? [];
}

// The full template question behind a picked hint (same id).
export async function getQuestionTemplate(
  templateId: string,
  { token, locale }: RequestOptions,
): Promise<QuestionTemplate | null> {
  const params = new URLSearchParams({ 'ids[]': templateId });
  const { ok, data, message } = await apiFetch<QuestionTemplate[]>(
    `${getCompanyApiUrl()}/question-templates?${params.toString()}`,
    { token, locale },
  );
  if (!ok) throw new Error(message ?? '');
  return (
    data?.data?.find((template) => String(template.id) === templateId) ?? null
  );
}
