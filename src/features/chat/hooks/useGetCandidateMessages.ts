'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { candidateChatQueryKeys } from '../constants';
import { getCandidateMessages } from '../services/candidate-chat-service';

export function useGetCandidateMessages(companyAdminId?: string) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: candidateChatQueryKeys.messages(locale, companyAdminId ?? ''),
    queryFn: () =>
      getCandidateMessages({
        token: token!,
        locale,
        companyAdminId: companyAdminId!,
      }),
    enabled: Boolean(token && companyAdminId),
  });
}
