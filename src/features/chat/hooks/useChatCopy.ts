'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { ChatConversation, ChatRole } from '../types/chat.types';
import { formatChatDate } from '../utils/chat-format';

// The texts that differ between the company and candidate chat. Everything else is shared copy.
export function useChatCopy(role: ChatRole) {
  const tCompany = useTranslations('companyPage.chat');
  const tCandidate = useTranslations('candidatePage.chat');
  const locale = useLocale();
  const isCandidate = role === 'candidate';

  return {
    listTitle: isCandidate ? tCandidate('list-title') : tCompany('inbox'),
    searchPlaceholder: isCandidate
      ? tCandidate('search-placeholder')
      : tCompany('search-placeholder'),
    closedLabel: isCandidate
      ? tCandidate('conversation-closed')
      : tCompany('chat-closed'),
    closedTimeline: (conversation: ChatConversation) => {
      const date = formatChatDate(conversation.closedAt ?? '', locale);
      return isCandidate
        ? tCandidate('closed-by-company', {
            company: conversation.companyName ?? conversation.name,
            date,
          })
        : tCompany('closed-by-you', { date });
    },
    closedNoticeTitle: (conversation: ChatConversation) =>
      isCandidate
        ? tCandidate('closed-notice-title', {
            company: conversation.companyName ?? conversation.name,
          })
        : tCompany('this-chat-is-closed'),
    closedNoticeDescription: (conversation: ChatConversation) =>
      isCandidate
        ? tCandidate('closed-notice-description')
        : tCompany('closed-description', { name: conversation.name }),
  };
}
