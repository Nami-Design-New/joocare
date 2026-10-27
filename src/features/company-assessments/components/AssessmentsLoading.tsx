import { Skeleton } from '@/shared/components/ui/skeleton';

export default function AssessmentsLoading() {
  return (
    <div aria-busy="true" className="space-y-8">
      <Skeleton className="h-8 w-60" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-18 w-full rounded-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
