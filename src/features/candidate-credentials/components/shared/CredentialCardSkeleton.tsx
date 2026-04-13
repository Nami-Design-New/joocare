"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

export function CredentialCardSkeleton() {
  return (
    <div className="flex flex-col justify-start gap-2 rounded-2xl border bg-white p-2 shadow sm:flex-row sm:items-center">
      <Skeleton className="h-38 w-40 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-3 p-2">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-6 w-3/5" />
          <div className="flex gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-2/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function CredentialCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, index) => (
        <CredentialCardSkeleton key={index} />
      ))}
    </div>
  );
}
