'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { candidateChatQueryKeys } from '../constants';
import { getCandidateConversations } from '../services/candidate-chat-service';

export function useGetCandidateConversations() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: candidateChatQueryKeys.conversations(locale),
    queryFn: () => getCandidateConversations({ token: token!, locale }),
    enabled: Boolean(token),
  });
}
