'use client';

import { useCandidateChat } from '../hooks/useCandidateChat';
import type { ChatScenario } from '../types/chat.types';
import ChatView from './ChatView';

type CandidateChatPageProps = {
  scenario: ChatScenario;
  conversationId?: string;
};

export default function CandidateChatPage(props: CandidateChatPageProps) {
  const chat = useCandidateChat(props);
  return (
    <ChatView
      role="candidate"
      chat={chat}
      className="h-[calc(100dvh-12rem)] max-h-220 min-h-144 rounded-2xl bg-card shadow-card"
    />
  );
}
