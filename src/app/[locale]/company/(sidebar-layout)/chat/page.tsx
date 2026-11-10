import CompanyChatPage from '@/features/chat/components/CompanyChatPage';
import type { ChatScenario } from '@/features/chat/types/chat.types';

type ChatPageProps = {
  searchParams: Promise<{
    conversation?: string;
    scenario?: string;
    view?: string;
    candidateId?: string;
    candidateName?: string;
    candidateImage?: string;
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
      initialConversation={
        query.candidateId &&
        query.candidateName &&
        query.conversation === `user-${query.candidateId}`
          ? {
              id: query.conversation,
              profileHref: `/company/candidate-profile?candidateId=${encodeURIComponent(query.candidateId)}`,
              name: query.candidateName,
              avatar:
                query.candidateImage ||
                '/assets/company-projects/candidate-avatar.png',
              jobTitle: '',
              lastMessage: '',
              updatedAt: '',
              unread: 0,
              recruiter: '',
              messages: [],
            }
          : undefined
      }
      scenario={scenario}
      superAdmin={query.view === 'super-admin'}
    />
  );
}
