import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import type { JobDetailsResponse } from '../types/jobs.types';

export async function getCompanyJob(
  jobId: number | string,
  { token, locale }: { token: string; locale: string },
) {
  const result = await apiFetch<JobDetailsResponse['data']>(
    `${getCompanyApiUrl()}/jobs/${jobId}`,
    { token, locale, cache: 'no-store' },
  );
  if (!result.ok) {
    throw createHttpStatusError(result.statusCode, result.message ?? '');
  }

  const job = result.data?.data?.job;
  if (!job) throw createHttpStatusError(404);
  return job;
}
