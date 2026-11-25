'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { getCandidateProfileHref } from '@/features/company-projects/utils/candidate-profile-href';
import { CHAT_DEFAULT_AVATAR, CHAT_ROUTES } from '../constants';
import type {
  ChatConversation,
  ChatViewState,
  SendChatMessage,
} from '../types/chat.types';
import {
  mapCompanyConversation,
  withConversationMessages,
} from '../utils/chat-mapper';
import { useChat } from './useChat';
import { useGetCompanyConversations } from './useGetCompanyConversations';
import { useGetCompanyMessages } from './useGetCompanyMessages';
import { useSendCompanyMessage } from './useSendCompanyMessage';
import { useSetCompanyConversationClosed } from './useSetCompanyConversationClosed';

/** A candidate opened from another page (pipeline, talent database) who has no conversation yet. */
export type CompanyChatCandidate = {
  id: string;
  name: string;
  image?: string;
};

type UseCompanyChatOptions = {
  conversationId?: string;
  candidate?: CompanyChatCandidate;
};

function createDraftConversation(
  candidate: CompanyChatCandidate,
): ChatConversation {
  return {
    id: candidate.id,
    profileHref: getCandidateProfileHref(candidate.id),
    name: candidate.name,
    avatar: candidate.image || CHAT_DEFAULT_AVATAR,
    jobTitle: '',
    lastMessage: '',
    updatedAt: '',
    unread: 0,
    recruiter: '',
    closed: false,
    messages: [],
  };
}

export function useCompanyChat({
  conversationId,
  candidate,
}: UseCompanyChatOptions) {
  const { status: sessionStatus } = useSession();
  const t = useTranslations('companyPage.chat');
  const labels = useMemo(
    () => ({ you: t('you'), imageAttachment: t('image-attachment') }),
    [t],
  );
  const conversationsQuery = useGetCompanyConversations();
  const conversations = useMemo(() => {
    const mapped = (conversationsQuery.data ?? []).map((item) =>
      mapCompanyConversation(item, labels),
    );
    const isNewCandidate =
      candidate &&
      candidate.id === conversationId &&
      !mapped.some((item) => item.id === candidate.id);
    return isNewCandidate
      ? [createDraftConversation(candidate), ...mapped]
      : mapped;
  }, [candidate, conversationId, conversationsQuery.data, labels]);
  const chat = useChat({
    conversations,
    conversationId,
    route: CHAT_ROUTES.company,
  });
  const activeId = chat.activeConversation?.id;
  const isDraft = Boolean(
    activeId &&
    !conversationsQuery.data?.some((item) => String(item.user_id) === activeId),
  );
  const messagesQuery = useGetCompanyMessages(isDraft ? undefined : activeId);
  const sendMutation = useSendCompanyMessage(activeId);
  const closeMutation = useSetCompanyConversationClosed(activeId);

  const conversationWithMessages =
    chat.activeConversation &&
    withConversationMessages(
      chat.activeConversation,
      messagesQuery.data,
      'company',
      labels,
    );
  const activeConversation = conversationWithMessages && {
    ...conversationWithMessages,
    alreadyContacted:
      conversationWithMessages.alreadyContacted &&
      !chat.isWarningDismissed(conversationWithMessages.id),
  };

  async function sendMessage(value: SendChatMessage) {
    if (!activeId || activeConversation?.closed || sendMutation.isPending) {
      return false;
    }
    try {
      await sendMutation.mutateAsync(value);
      chat.releaseAttachments(value.attachments);
      return true;
    } catch {
      // The mutation hook shows the error toast.
      return false;
    }
  }

  function setClosed(closed: boolean) {
    if (activeId && !closeMutation.isPending) closeMutation.mutate(closed);
  }

  const state: ChatViewState = {
    ...chat,
    activeConversation,
    sendMessage,
    setClosed,
    isClosePending: closeMutation.isPending,
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
