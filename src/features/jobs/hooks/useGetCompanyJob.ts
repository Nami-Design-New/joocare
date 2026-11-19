import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getCompanyJob } from '../services/company-job-service';
import { useLocale } from 'next-intl';

/**
 * Client-side hook to fetch a single company job by ID.
 * Used by the PostJobForm to hydrate form data in "complete" and "edit" modes.
 */
export function useGetCompanyJob(jobId: number | string | null) {
  const { data: session } = useSession();
  const token = session?.accessToken || '';
  const locale = useLocale();

  return useQuery({
    queryKey: ['company-job', locale, jobId],
    queryFn: () => getCompanyJob(jobId ?? '', { token, locale }),
    enabled: !!jobId && !!token,
    staleTime: 0,
  });
}
