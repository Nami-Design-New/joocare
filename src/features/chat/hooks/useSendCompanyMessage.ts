'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { companyChatQueryKeys } from '../constants';
import { sendCompanyMessage } from '../services/company-chat-service';
import type { SendChatMessage } from '../types/chat.types';

export function useSendCompanyMessage(userId?: string) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();
  const t = useTranslations('companyPage.chat');

  return useMutation({
    mutationFn: (value: SendChatMessage) => {
      if (!token || !userId) throw new Error(t('send-failed'));
      return sendCompanyMessage({ token, locale, userId, value });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: companyChatQueryKeys.conversations(locale),
        }),
        queryClient.invalidateQueries({
          queryKey: companyChatQueryKeys.messages(locale, userId ?? ''),
        }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('send-failed'));
    },
  });
}
