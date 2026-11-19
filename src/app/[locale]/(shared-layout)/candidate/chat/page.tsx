import CandidateChatPage from '@/features/chat/components/CandidateChatPage';

type ChatPageProps = {
  searchParams: Promise<{
    conversation?: string;
  }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const query = await searchParams;
  return <CandidateChatPage conversationId={query.conversation} />;
}
