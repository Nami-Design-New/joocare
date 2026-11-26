'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { getCandidateLinkResult } from '../services/candidate-link-service';

export function useGetCandidateLinkResult(
  assessmentId: string,
  userId: string,
) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';
  return useQuery({
    queryKey: ['candidate-link-result', locale, assessmentId, userId],
    queryFn: () =>
      getCandidateLinkResult(assessmentId, userId, { token, locale }),
    enabled: Boolean(token && assessmentId && userId),
  });
}
