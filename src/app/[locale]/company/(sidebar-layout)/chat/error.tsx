'use client';

import ChatError from '@/features/chat/components/ChatError';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ChatError error={error} reset={reset} />;
}
