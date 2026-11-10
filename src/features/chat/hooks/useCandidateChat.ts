'use client';

import { CHAT_ROUTES } from '../constants';
import { createCandidateChatPreview } from '../constants/candidate-chat-preview';
import type { ChatScenario } from '../types/chat.types';
import { useChat } from './useChat';

type UseCandidateChatOptions = {
  scenario: ChatScenario;
  conversationId?: string;
};

export function useCandidateChat({
  scenario,
  conversationId,
}: UseCandidateChatOptions) {
  return useChat({
    initialConversations: () => createCandidateChatPreview(scenario),
    conversationId,
    getConversationHref: (id) => {
      const query = new URLSearchParams();
      if (id) query.set('conversation', id);
      if (scenario !== 'conversation') query.set('scenario', scenario);
      return `${CHAT_ROUTES.candidate}${query.size ? `?${query}` : ''}`;
    },
  });
}
