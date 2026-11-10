import { Skeleton } from '@/shared/components/ui/skeleton';

export default function CompanyLoading() {
  return (
    <div aria-busy="true" className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-13 w-full rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-52 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
