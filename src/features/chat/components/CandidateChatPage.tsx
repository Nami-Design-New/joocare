'use client';

import { CHAT_LAYOUT_CLASS } from '../constants';
import { useCandidateChat } from '../hooks/useCandidateChat';
import ChatView from './ChatView';
import ChatLoading from './ChatLoading';
import ChatError from './ChatError';

type CandidateChatPageProps = {
  conversationId?: string;
};

export default function CandidateChatPage(props: CandidateChatPageProps) {
  const { isLoading, error, refetch, ...chat } = useCandidateChat(props);

  if (isLoading) return <ChatLoading role="candidate" />;
  if (error) return <ChatError error={error} reset={() => void refetch()} />;

  return (
    <ChatView
      role="candidate"
      chat={chat}
      className={CHAT_LAYOUT_CLASS.candidate}
    />
  );
}
