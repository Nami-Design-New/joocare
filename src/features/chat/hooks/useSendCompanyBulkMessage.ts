'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { companyChatQueryKeys } from '../constants';
import { sendCompanyBulkMessage } from '../services/company-chat-service';

type BulkMessageInput = { userIds: string[]; message: string };

// One message to several candidates (e.g. the selected Talent Database rows).
export function useSendCompanyBulkMessage() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();
  const t = useTranslations('companyPage.chat');

  return useMutation({
    mutationFn: ({ userIds, message }: BulkMessageInput) => {
      if (!token) throw new Error(t('send-failed'));
      return sendCompanyBulkMessage({ token, locale, userIds, message });
    },
    onSuccess: async (_result, { userIds }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: companyChatQueryKeys.conversations(locale),
        }),
        ...userIds.map((userId) =>
          queryClient.invalidateQueries({
            queryKey: companyChatQueryKeys.messages(locale, userId),
          }),
        ),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('send-failed'));
    },
  });
}
