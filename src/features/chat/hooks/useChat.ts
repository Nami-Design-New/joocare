'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import type { ChatAttachment, ChatConversation } from '../types/chat.types';

type UseChatOptions = {
  conversations: ChatConversation[];
  conversationId?: string;
  /** Chat page route (`CHAT_ROUTES.company` / `CHAT_ROUTES.candidate`). */
  route: string;
};

// UI state shared by every role: search, selection, image preview and local attachment URLs.
export function useChat({
  conversations,
  conversationId,
  route,
}: UseChatOptions) {
  const t = useTranslations('companyPage.chat');
  const locale = useLocale();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<ChatAttachment | null>(null);
  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);
  const objectUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

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

  function selectConversation(id?: string) {
    const query = new URLSearchParams();
    if (id) query.set('conversation', id);
    router.push(`${route}${query.size ? `?${query}` : ''}`, { scroll: false });
  }

  function createObjectUrl(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    return url;
  }

  /** Frees the local preview URLs of attachments that were sent. */
  function releaseAttachments(attachments: ChatAttachment[]) {
    attachments.forEach(({ url }) => {
      if (!url?.startsWith('blob:')) return;
      URL.revokeObjectURL(url);
      objectUrls.current.delete(url);
    });
  }

  function downloadAttachment(attachment: ChatAttachment) {
    if (!attachment.url) {
      toast.info(t('attachment-unavailable'));
      return;
    }
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
  }

  function dismissContactWarning() {
    if (activeConversation) {
      setDismissedWarnings((current) => [...current, activeConversation.id]);
    }
  }

  return {
    conversations: filteredConversations,
    selectedConversation,
    activeConversation,
    isWarningDismissed: (id: string) => dismissedWarnings.includes(id),
    mobileConversationOpen: Boolean(selectedConversation),
    search,
    setSearch,
    selectConversation,
    dismissContactWarning,
    previewImage,
    setPreviewImage,
    downloadAttachment,
    createObjectUrl,
    releaseAttachments,
  };
}
