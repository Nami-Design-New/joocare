'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { companyChatQueryKeys } from '../constants';
import { getCompanyMessages } from '../services/company-chat-service';

export function useGetCompanyMessages(userId?: string) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: companyChatQueryKeys.messages(locale, userId ?? ''),
    queryFn: () =>
      getCompanyMessages({ token: token!, locale, userId: userId! }),
    enabled: Boolean(token && userId),
  });
}
