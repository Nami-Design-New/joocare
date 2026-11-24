'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { companyChatQueryKeys } from '../constants';
import { setCompanyConversationClosed } from '../services/company-chat-service';

export function useSetCompanyConversationClosed(userId?: string) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();
  const t = useTranslations('companyPage.chat');

  return useMutation({
    mutationFn: (closed: boolean) => {
      if (!token || !userId) {
        throw new Error(t(closed ? 'close-failed' : 'reopen-failed'));
      }
      return setCompanyConversationClosed({ token, locale, userId, closed });
    },
    onSuccess: async (_, closed) => {
      toast.success(t(closed ? 'closed-success' : 'reopened-success'));
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: companyChatQueryKeys.conversations(locale),
        }),
        queryClient.invalidateQueries({
          queryKey: companyChatQueryKeys.messages(locale, userId ?? ''),
        }),
      ]);
    },
    onError: (error: Error, closed) => {
      toast.error(
        error.message || t(closed ? 'close-failed' : 'reopen-failed'),
      );
    },
  });
}
