'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { CHAT_ROUTES } from '../constants';
import type { ChatViewState, SendChatMessage } from '../types/chat.types';
import {
  mapCandidateConversation,
  withConversationMessages,
} from '../utils/chat-mapper';
import { useChat } from './useChat';
import { useGetCandidateConversations } from './useGetCandidateConversations';
import { useGetCandidateMessages } from './useGetCandidateMessages';
import { useSendCandidateMessage } from './useSendCandidateMessage';

type UseCandidateChatOptions = {
  conversationId?: string;
};

export function useCandidateChat({ conversationId }: UseCandidateChatOptions) {
  const { status: sessionStatus } = useSession();
  const t = useTranslations('companyPage.chat');
  const labels = useMemo(
    () => ({ you: t('you'), imageAttachment: t('image-attachment') }),
    [t],
  );
  const conversationsQuery = useGetCandidateConversations();
  const conversations = useMemo(
    () =>
      (conversationsQuery.data ?? []).map((item) =>
        mapCandidateConversation(item, labels),
      ),
    [conversationsQuery.data, labels],
  );
  const chat = useChat({
    conversations,
    conversationId,
    route: CHAT_ROUTES.candidate,
  });
  const activeId = chat.activeConversation?.id;
  const messagesQuery = useGetCandidateMessages(activeId);
  const sendMutation = useSendCandidateMessage(activeId);

  const activeConversation = useMemo(
    () =>
      chat.activeConversation &&
      withConversationMessages(
        chat.activeConversation,
        messagesQuery.data,
        'user',
        labels,
      ),
    [chat.activeConversation, messagesQuery.data, labels],
  );

  async function sendMessage(value: SendChatMessage) {
    if (!activeId || sendMutation.isPending) return false;
    try {
      await sendMutation.mutateAsync(value);
      chat.releaseAttachments(value.attachments);
      return true;
    } catch {
      // The mutation hook shows the error toast.
      return false;
    }
  }

  const state: ChatViewState = {
    ...chat,
    activeConversation,
    sendMessage,
  };

  return {
    ...state,
    isLoading:
      sessionStatus === 'loading' ||
      conversationsQuery.isLoading ||
      messagesQuery.isLoading,
    error: conversationsQuery.error ?? messagesQuery.error,
    refetch: async () => {
      await Promise.all([
        conversationsQuery.refetch(),
        messagesQuery.refetch(),
      ]);
    },
  };
}
