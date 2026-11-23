'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getPinnedCandidateIds } from '../services/candidate-pin-service';

export const PINNED_CANDIDATES_QUERY_KEY = 'company-pinned-candidates';

export function useGetPinnedCandidateIds() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: [PINNED_CANDIDATES_QUERY_KEY, locale],
    queryFn: () => getPinnedCandidateIds({ token: token ?? '', locale }),
    enabled: !!token,
  });
}
