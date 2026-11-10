import { cva } from 'class-variance-authority';
import { useChatCopy } from '../hooks/useChatCopy';
import type { ChatRole } from '../types/chat.types';
import ChatIcon from './ChatIcon';

const closedBadgeVariants = cva(
  'inline-flex shrink-0 items-center rounded-full font-semibold',
  {
    variants: {
      role: {
        company:
          'text-chat-muted bg-chat-surface gap-1 px-2 py-0.5 text-[10px] leading-3.5',
        candidate:
          'text-chat-danger bg-chat-danger-bg gap-2 px-4 py-2.5 text-sm leading-5',
      },
    },
  },
);

type ChatClosedBadgeProps = { role: ChatRole };

export default function ChatClosedBadge({ role }: ChatClosedBadgeProps) {
  const copy = useChatCopy(role);
  return (
    <span className={closedBadgeVariants({ role })}>
      <ChatIcon
        name={role === 'candidate' ? 'close-chat' : 'lock'}
        width={role === 'candidate' ? 18 : 12}
      />
      {copy.closedLabel}
    </span>
  );
}
