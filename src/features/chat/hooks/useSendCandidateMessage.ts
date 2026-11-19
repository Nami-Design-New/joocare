'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { candidateChatQueryKeys } from '../constants';
import { sendCandidateMessage } from '../services/candidate-chat-service';
import type { SendChatMessage } from '../types/chat.types';

export function useSendCandidateMessage(companyAdminId?: string) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();
  const t = useTranslations('companyPage.chat');

  return useMutation({
    mutationFn: (value: SendChatMessage) => {
      if (!token || !companyAdminId) {
        throw new Error(t('send-failed'));
      }

      return sendCandidateMessage({
        token,
        locale,
        companyAdminId,
        value,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: candidateChatQueryKeys.conversations(locale),
        }),
        ...(companyAdminId
          ? [
              queryClient.invalidateQueries({
                queryKey: candidateChatQueryKeys.messages(
                  locale,
                  companyAdminId,
                ),
              }),
            ]
          : []),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('send-failed'));
    },
  });
}
