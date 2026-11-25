'use client';

import { useCandidateChat } from '../hooks/useCandidateChat';
import ChatView from './ChatView';
import ChatLoading from './ChatLoading';
import ChatError from './ChatError';

type CandidateChatPageProps = {
  conversationId?: string;
};

export default function CandidateChatPage(props: CandidateChatPageProps) {
  const { isLoading, error, refetch, ...chat } = useCandidateChat(props);

  if (isLoading) return <ChatLoading />;
  if (error) return <ChatError error={error} reset={() => void refetch()} />;

  return (
    <ChatView
      role="candidate"
      chat={chat}
      className="h-[calc(100dvh-12rem)] max-h-220 min-h-144 rounded-2xl bg-card shadow-card"
    />
  );
}
