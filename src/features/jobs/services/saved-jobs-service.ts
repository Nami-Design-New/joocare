import { getServerSession } from 'next-auth';

import { authOptions } from '@/auth';
import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import type { JobListItem, JobsListingResponse } from '../types/jobs.types';

const SAVED_JOBS_PAGE_SIZE = 10;

export async function getSavedJobs(
  page: number,
  locale: string,
): Promise<JobsListingResponse> {
  const session = await getServerSession(authOptions);
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(SAVED_JOBS_PAGE_SIZE),
    page: String(page),
  });

  const result = await apiFetch<JobListItem[]>(
    `${getUserApiUrl()}/saved-jobs?${params.toString()}`,
    {
      method: 'GET',
      locale,
      token: session?.accessToken,
      cache: 'no-store',
    },
  );

  if (!result.ok || !result.data) {
    throw createHttpStatusError(
      result.statusCode || 500,
      result.message || 'Failed to load saved jobs.',
    );
  }

  const response = result.data as JobsListingResponse;

  if (!Array.isArray(response.data)) {
    throw new Error('Saved jobs payload is missing.');
  }

  return response;
}

// The Saved tab has no pagination in the design, so it lists every page.
export async function getAllSavedJobs(locale: string) {
  const first = await getSavedJobs(1, locale);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.last_page - 1) }, (_, index) =>
      getSavedJobs(index + 2, locale),
    ),
  );
  return [first, ...rest].flatMap((response) => response.data);
}
