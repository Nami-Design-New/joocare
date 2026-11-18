'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getProfileVisitsService } from '../services/profile-visits-service';

export const profileVisitsQueryKey = (
  locale: string,
  page: number,
  search: string,
) => ['profile-visits', locale, page, search];

type UseGetProfileVisitsOptions = {
  page: number;
  search: string;
};

export default function useGetProfileVisits({
  page,
  search,
}: UseGetProfileVisitsOptions) {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: profileVisitsQueryKey(locale, page, search),
    queryFn: () => getProfileVisitsService({ locale, token, page, search }),
    enabled: status === 'authenticated' && Boolean(token),
  });
}
