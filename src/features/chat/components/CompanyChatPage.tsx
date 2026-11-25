'use client';

import { useSession } from 'next-auth/react';
import { CHAT_LAYOUT_CLASS, CHAT_SUPER_ADMIN_ROLE } from '../constants';
import {
  useCompanyChat,
  type CompanyChatCandidate,
} from '../hooks/useCompanyChat';
import ChatError from './ChatError';
import ChatLoading from './ChatLoading';
import ChatView from './ChatView';

type CompanyChatPageProps = {
  conversationId?: string;
  candidate?: CompanyChatCandidate;
};

export default function CompanyChatPage(props: CompanyChatPageProps) {
  const { data: session } = useSession();
  const { isLoading, error, refetch, ...chat } = useCompanyChat(props);

  if (isLoading) return <ChatLoading />;
  if (error) return <ChatError error={error} reset={() => void refetch()} />;

  return (
    <ChatView
      role="company"
      chat={chat}
      superAdmin={session?.companyRole === CHAT_SUPER_ADMIN_ROLE}
      className={CHAT_LAYOUT_CLASS.company}
    />
  );
}
