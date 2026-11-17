import { Skeleton } from '@/shared/components/ui/skeleton';

const FIELDS = Array.from({ length: 6 }, (_, index) => index);

// Placeholder for the completion card and the first form section while loading.
export default function AdditionalInfoSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-27 w-full rounded-2xl" />
      <div className="flex flex-col gap-5 rounded-2xl bg-card px-4 pt-7.5 pb-6 md:px-10">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {FIELDS.map((index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-13 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
