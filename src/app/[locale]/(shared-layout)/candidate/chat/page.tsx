import CandidateChatPage from '@/features/chat/components/CandidateChatPage';
import type { ChatScenario } from '@/features/chat/types/chat.types';

type ChatPageProps = {
  searchParams: Promise<{
    conversation?: string;
    scenario?: string;
  }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const query = await searchParams;
  const scenario: ChatScenario =
    query.scenario === 'closed' ? 'closed' : 'conversation';
  return (
    <CandidateChatPage
      key={scenario}
      conversationId={query.conversation}
      scenario={scenario}
    />
  );
}
