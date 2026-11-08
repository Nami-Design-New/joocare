import { getServerSession } from 'next-auth';

import { authOptions } from '@/auth';
import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import type {
  CandidateApplicationItem,
  CandidateApplicationsResponse,
} from '../types/jobs.types';

const APPLICATIONS_PAGE_SIZE = 10;

export async function getApplications(
  page: number,
  locale: string,
  search = '',
): Promise<CandidateApplicationsResponse> {
  const session = await getServerSession(authOptions);
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(APPLICATIONS_PAGE_SIZE),
    page: String(page),
  });
  // Job title search; filtering is done by the API.
  if (search) params.set('search', search);

  const result = await apiFetch<CandidateApplicationItem[]>(
    `${getUserApiUrl()}/applications?${params.toString()}`,
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
      result.message || 'Failed to load applications.',
    );
  }

  const response = result.data as CandidateApplicationsResponse;

  if (!Array.isArray(response.data)) {
    throw new Error('Applications payload is missing.');
  }

  return response;
}
