'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getProfileDetailsService } from '../services/profile-details-service';
import type { ProfileDetails } from '../types/profile-details.types';

export const profileDetailsQueryKey = (locale: string) => [
  'candidate-profile-details',
  locale,
];

// `select` lets a component read only the part it needs from the cached response.
export default function useGetProfileDetails<T = ProfileDetails>(
  select?: (details: ProfileDetails) => T,
) {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: profileDetailsQueryKey(locale),
    queryFn: () => getProfileDetailsService({ token, locale }),
    enabled: status === 'authenticated' && Boolean(token),
    select,
  });
}
