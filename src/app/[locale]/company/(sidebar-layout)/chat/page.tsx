import CompanyChatPage from '@/features/chat/components/CompanyChatPage';
import type { ChatScenario } from '@/features/chat/types/chat.types';

type ChatPageProps = {
  searchParams: Promise<{
    conversation?: string;
    scenario?: string;
    view?: string;
  }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const query = await searchParams;
  const scenario: ChatScenario =
    query.scenario === 'image-and-reply' ||
    query.scenario === 'already-contacted' ||
    query.scenario === 'closed'
      ? query.scenario
      : 'conversation';
  return (
    <CompanyChatPage
      key={scenario}
      conversationId={query.conversation}
      scenario={scenario}
      superAdmin={query.view === 'super-admin'}
    />
  );
}
