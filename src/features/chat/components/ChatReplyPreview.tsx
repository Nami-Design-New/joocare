import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import type { ChatReply } from '../types/chat.types';

type ChatReplyPreviewProps = { reply: ChatReply; outgoing?: boolean };

export default function ChatReplyPreview({
  reply,
  outgoing,
}: ChatReplyPreviewProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2 rounded-lg border-s-2 border-chat-primary bg-chat-surface px-3 py-2',
        outgoing && 'border-primary-foreground bg-primary-foreground/15',
      )}
    >
      {reply.image && (
        <Image
          src={reply.image}
          alt=""
          width={32}
          height={32}
          unoptimized
          className="size-8 shrink-0 rounded object-cover"
        />
      )}
      <div className="min-w-0">
        <p className="truncate text-xs leading-4 font-semibold">{reply.name}</p>
        <p
          className={cn(
            'mt-0.5 truncate text-xs leading-4 text-muted-foreground',
            outgoing && 'text-primary-foreground/80',
          )}
        >
          {reply.text}
        </p>
      </div>
    </div>
  );
}
