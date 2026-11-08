import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ApplicationsLoading() {
  return (
    <div className="space-y-6 pt-4">
      <Skeleton className="h-15 w-56 rounded-full" />
      <div className="grid gap-4 xl:grid-cols-2">
        {[0, 1].map((id) => (
          <Skeleton key={id} className="h-82 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
