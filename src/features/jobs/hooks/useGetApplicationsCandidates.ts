'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getApplicationsCandidates } from '../services/applications-candidates-service';
import type { PipelineFilters } from '../types/job-candidates.types';

export const APPLICATION_CANDIDATES_QUERY_KEY = 'application-candidates';

type UseGetApplicationsCandidatesParams = {
  jobId: number;
  page: number;
  filters: Partial<PipelineFilters>;
  enabled?: boolean;
};

export default function useGetApplicationsCandidates({
  jobId,
  page,
  filters,
  enabled = true,
}: UseGetApplicationsCandidatesParams) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: [APPLICATION_CANDIDATES_QUERY_KEY, locale, jobId, page, filters],
    queryFn: () =>
      getApplicationsCandidates({
        jobId,
        page,
        filters,
        token: token ?? '',
        locale,
      }),
    enabled: enabled && !!token && Number.isFinite(jobId),
    placeholderData: keepPreviousData,
  });
}
