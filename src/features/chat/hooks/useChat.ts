'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import type {
  ChatAttachment,
  ChatConversation,
  SendChatMessage,
} from '../types/chat.types';

type UseChatOptions = {
  initialConversations: () => ChatConversation[];
  conversationId?: string;
  /** URL of the chat page with the given conversation selected (none = list view on mobile). */
  getConversationHref: (conversationId?: string) => string;
};

// Shared chat state for every role: conversation list, search, selection and the local message flow.
export function useChat({
  initialConversations,
  conversationId,
  getConversationHref,
}: UseChatOptions) {
  const t = useTranslations('companyPage.chat');
  const locale = useLocale();
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<ChatAttachment | null>(null);
  const objectUrls = useRef(new Set<string>());
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function createObjectUrl(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    return url;
  }
  const selectedConversation = conversations.find(
    (item) => item.id === conversationId,
  );
  const activeConversation = selectedConversation ?? conversations[0];
  const filteredConversations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(locale);
    return conversations.filter((item) =>
      [item.name, item.jobTitle, item.companyName]
        .join(' ')
        .toLocaleLowerCase(locale)
        .includes(query),
    );
  }, [conversations, search, locale]);

  function updateConversation(
    id: string,
    update: (conversation: ChatConversation) => ChatConversation,
  ) {
    setConversations((current) =>
      current.map((item) => (item.id === id ? update(item) : item)),
    );
  }

  function selectConversation(id?: string) {
    if (id) updateConversation(id, (item) => ({ ...item, unread: 0 }));
    router.push(getConversationHref(id), { scroll: false });
  }

  function sendMessage(value: SendChatMessage) {
    if (
      !activeConversation ||
      activeConversation.closedAt ||
      (!value.text.trim() && !value.attachments.length)
    )
      return;
    const now = new Date().toISOString();
    updateConversation(activeConversation.id, (item) => ({
      ...item,
      unread: 0,
      updatedAt: now,
      lastMessage:
        value.text.trim() ||
        value.attachments.map((attachment) => attachment.name).join(', '),
      messages: [
        ...item.messages,
        {
          id: crypto.randomUUID(),
          direction: 'outgoing',
          text: value.text.trim(),
          sentAt: now,
          day: 'today',
          attachments: value.attachments,
          reply: value.reply,
        },
      ],
    }));
  }

  function setClosed(closed: boolean) {
    if (!activeConversation) return;
    updateConversation(activeConversation.id, (item) => ({
      ...item,
      closedAt: closed ? new Date().toISOString() : undefined,
    }));
    toast.success(t(closed ? 'closed-success' : 'reopened-success'));
  }

  function dismissContactWarning() {
    if (activeConversation)
      updateConversation(activeConversation.id, (item) => ({
        ...item,
        alreadyContacted: false,
      }));
  }

  function downloadAttachment(attachment: ChatAttachment) {
    if (!attachment.url) {
      toast.info(t('attachment-unavailable'));
      return;
    }
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
  }

  return {
    conversations: filteredConversations,
    activeConversation,
    mobileConversationOpen: Boolean(selectedConversation),
    search,
    setSearch,
    selectConversation,
    sendMessage,
    setClosed,
    dismissContactWarning,
    previewImage,
    setPreviewImage,
    downloadAttachment,
    createObjectUrl,
  };
}

export type ChatState = ReturnType<typeof useChat>;
