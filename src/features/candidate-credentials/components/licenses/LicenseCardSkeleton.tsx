"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

export function LicenseCardSkeleton() {
  return (
    <div className="flex flex-col justify-start gap-2 rounded-2xl border bg-white p-2 shadow">
      <Skeleton className="h-66 w-full rounded-sm" />
      <div className="flex w-full flex-col gap-2 p-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LicenseCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <LicenseCardSkeleton key={index} />
      ))}
    </div>
  );
}
