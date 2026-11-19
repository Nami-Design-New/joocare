'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { ChatAttachment, SendChatMessage } from '../types/chat.types';
import {
  mapCandidateConversation,
  mapCandidateMessages,
} from '../utils/candidate-chat-mapper';
import { useGetCandidateConversations } from './useGetCandidateConversations';
import { useGetCandidateMessages } from './useGetCandidateMessages';
import { useSendCandidateMessage } from './useSendCandidateMessage';

type UseCandidateChatOptions = {
  conversationId?: string;
};

export function useCandidateChat({ conversationId }: UseCandidateChatOptions) {
  const { status: sessionStatus } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('companyPage.chat');
  const conversationsQuery = useGetCandidateConversations();
  const mappedConversations = useMemo(
    () =>
      (conversationsQuery.data ?? []).map((item) => {
        const conversation = mapCandidateConversation(item);
        return {
          ...conversation,
          lastMessage:
            conversation.lastMessage ||
            (item.last_message?.images.length ? t('image-attachment') : ''),
        };
      }),
    [conversationsQuery.data, t],
  );
  const activeId = conversationId ?? mappedConversations[0]?.id;
  const messagesQuery = useGetCandidateMessages(activeId);
  const sendMutation = useSendCandidateMessage(activeId);
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<ChatAttachment | null>(null);
  const objectUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const activeConversation = useMemo(() => {
    const conversation = mappedConversations.find(
      (item) => item.id === activeId,
    );
    if (!conversation) return undefined;
    return {
      ...conversation,
      messages: mapCandidateMessages(
        messagesQuery.data ?? [],
        conversation,
        t('you'),
        conversation.name,
        t('image-attachment'),
      ),
    };
  }, [activeId, mappedConversations, messagesQuery.data, t]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(locale);
    return mappedConversations.filter((item) =>
      [item.name, item.jobTitle, item.companyName]
        .join(' ')
        .toLocaleLowerCase(locale)
        .includes(query),
    );
  }, [locale, mappedConversations, search]);

  function selectConversation(id?: string) {
    const query = new URLSearchParams();
    if (id) query.set('conversation', id);
    router.push(`/candidate/chat${query.size ? `?${query}` : ''}`, {
      scroll: false,
    });
  }

  async function sendMessage(value: SendChatMessage) {
    if (!activeId || sendMutation.isPending) return false;
    try {
      await sendMutation.mutateAsync(value);
      value.attachments.forEach((attachment) => {
        if (attachment.url?.startsWith('blob:')) {
          URL.revokeObjectURL(attachment.url);
          objectUrls.current.delete(attachment.url);
        }
      });
      return true;
    } catch {
      // The mutation hook displays the localized error toast.
      return false;
    }
  }

  function createObjectUrl(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    return url;
  }

  function downloadAttachment(attachment: ChatAttachment) {
    if (!attachment.url) return;
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name || 'image';
    link.click();
  }

  return {
    conversations: filteredConversations,
    activeConversation,
    mobileConversationOpen: Boolean(conversationId && activeConversation),
    search,
    setSearch,
    selectConversation,
    sendMessage,
    setClosed: () => undefined,
    dismissContactWarning: () => undefined,
    previewImage,
    setPreviewImage,
    downloadAttachment,
    createObjectUrl,
    isLoading:
      sessionStatus === 'loading' ||
      conversationsQuery.isLoading ||
      messagesQuery.isLoading,
    isError: conversationsQuery.isError || messagesQuery.isError,
    error: conversationsQuery.error ?? messagesQuery.error,
    refetch: async () => {
      await Promise.all([
        conversationsQuery.refetch(),
        messagesQuery.refetch(),
      ]);
    },
  };
}
