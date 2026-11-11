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
          'gap-1 bg-chat-surface px-2 py-0.5 text-[10px] leading-3.5 text-chat-muted',
        candidate:
          'gap-2 bg-chat-danger-bg px-4 py-2.5 text-sm leading-5 text-chat-danger',
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
