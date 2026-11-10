'use client';

import { useCompanyChat } from '../hooks/useCompanyChat';
import type { ChatConversation, ChatViewOptions } from '../types/chat.types';
import ChatView from './ChatView';

type CompanyChatPageProps = ChatViewOptions & {
  conversationId?: string;
  initialConversation?: ChatConversation;
};

export default function CompanyChatPage(props: CompanyChatPageProps) {
  const chat = useCompanyChat(props);
  const showReplyPreview =
    props.scenario === 'image-and-reply' &&
    chat.activeConversation?.id === 'emily';
  return (
    <ChatView
      role="company"
      chat={chat}
      superAdmin={props.superAdmin}
      initialReplyMessage={
        showReplyPreview ? chat.activeConversation?.messages[0] : undefined
      }
      className="mx-auto h-[calc(100dvh-4.75rem)] md:h-[calc(100dvh-10.875rem)] md:max-h-256 md:min-h-144"
    />
  );
}
