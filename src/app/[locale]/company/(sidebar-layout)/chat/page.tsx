import CompanyChatPage from '@/features/chat/components/CompanyChatPage';

type ChatPageProps = {
  searchParams: Promise<{
    conversation?: string;
    candidateName?: string;
    candidateImage?: string;
  }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const query = await searchParams;
  return (
    <CompanyChatPage
      conversationId={query.conversation}
      candidate={
        query.conversation && query.candidateName
          ? {
              id: query.conversation,
              name: query.candidateName,
              image: query.candidateImage,
            }
          : undefined
      }
    />
  );
}
