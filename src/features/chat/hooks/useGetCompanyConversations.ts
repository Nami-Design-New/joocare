'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { companyChatQueryKeys } from '../constants';
import { getCompanyConversations } from '../services/company-chat-service';

export function useGetCompanyConversations() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: companyChatQueryKeys.conversations(locale),
    queryFn: () => getCompanyConversations({ token: token!, locale }),
    enabled: Boolean(token),
  });
}
