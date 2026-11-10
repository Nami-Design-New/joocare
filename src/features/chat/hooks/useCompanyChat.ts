'use client';

import {
  ASSESSMENT_ASSETS,
  externalInvitationSeeds,
} from '@/features/company-assessments/constants/assessment-invitations';
import { CHAT_ROUTES } from '../constants';
import { createChatPreview } from '../constants/chat-preview';
import type { ChatViewOptions } from '../types/chat.types';
import { useChat } from './useChat';

export function useCompanyChat(
  options: ChatViewOptions & { conversationId?: string },
) {
  return useChat({
    initialConversations: () => [
      ...createChatPreview(options.scenario),
      ...externalInvitationSeeds.map((candidate) => ({
        id: `assessment-${candidate.id}`,
        profileHref: `/company/candidate-profile?candidateId=${encodeURIComponent(candidate.id)}`,
        name: candidate.name,
        jobTitle: '',
        avatar: `${ASSESSMENT_ASSETS}/${candidate.image}`,
        lastMessage: '',
        updatedAt: '',
        unread: 0,
        recruiter: '',
        messages: [],
      })),
    ],
    conversationId: options.conversationId,
    getConversationHref: (id) => {
      const query = new URLSearchParams();
      if (id) query.set('conversation', id);
      if (options.superAdmin) query.set('view', 'super-admin');
      if (options.scenario !== 'conversation')
        query.set('scenario', options.scenario);
      return `${CHAT_ROUTES.company}${query.size ? `?${query}` : ''}`;
    },
  });
}
