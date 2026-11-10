import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ChatLoading() {
  return (
    <div
      aria-busy="true"
      className="bg-card mx-auto flex h-[calc(100dvh-4.75rem)] max-w-256 overflow-hidden md:h-[calc(100dvh-10.875rem)] md:min-h-144"
    >
      <div className="bg-chat-list w-full space-y-6 p-6 md:w-80 xl:w-95">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-full rounded-xl" />
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      <div className="hidden flex-1 space-y-8 p-8 md:block">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-28 w-4/5" />
        <Skeleton className="ms-auto h-28 w-4/5" />
      </div>
    </div>
  );
}
