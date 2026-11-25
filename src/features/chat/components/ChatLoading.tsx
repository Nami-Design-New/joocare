import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { CHAT_LAYOUT_CLASS } from '../constants';
import type { ChatRole } from '../types/chat.types';

type ChatLoadingProps = {
  role?: ChatRole;
};

export default function ChatLoading({ role = 'company' }: ChatLoadingProps) {
  return (
    <div
      aria-busy="true"
      className={cn('flex overflow-hidden bg-card', CHAT_LAYOUT_CLASS[role])}
    >
      <div className="w-full shrink-0 space-y-6 bg-chat-list p-6 md:w-80 xl:w-95">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-full rounded-xl" />
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      <div className="hidden min-w-0 flex-1 space-y-8 p-8 md:block">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-28 w-4/5" />
        <Skeleton className="ms-auto h-28 w-4/5" />
      </div>
    </div>
  );
}
