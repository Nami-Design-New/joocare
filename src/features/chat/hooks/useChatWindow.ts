'use client';

import { useRef, useState } from 'react';
import type { ChatMessage } from '../types/chat.types';

export function useChatWindow(initialReplyMessage?: ChatMessage) {
  const [replyMessage, setReplyMessage] = useState<ChatMessage | null>(
    initialReplyMessage ?? null,
  );
  const composerContainer = useRef<HTMLDivElement>(null);

  function replyToMessage(message: ChatMessage) {
    setReplyMessage(message);
    requestAnimationFrame(() =>
      composerContainer.current?.querySelector('textarea')?.focus(),
    );
  }

  return {
    replyMessage,
    replyToMessage,
    cancelReply: () => setReplyMessage(null),
    composerContainer,
  };
}
