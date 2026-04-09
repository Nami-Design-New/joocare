"use client";

import { Button } from "@/shared/components/ui/button";
import useGetQualifications from "../../hooks/useGetQualifications";
import QualificationCard from "./QualificationCard";

function QualificationCardSkeleton() {
  return (
    <div className="flex flex-col justify-start gap-2 rounded-2xl border bg-white p-2 shadow sm:flex-row sm:items-center">
      <div className="h-38 w-40 shrink-0 animate-pulse rounded-lg bg-slate-200" />
      <div className="flex flex-1 flex-col gap-3 p-2">
        <div className="flex items-start justify-between gap-4">
          <div className="h-6 w-3/5 animate-pulse rounded bg-slate-200" />
          <div className="flex gap-3">
            <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
        <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function QualificationsContent() {
  const {
    qualifications,
    isInitialLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetQualifications();

  if (isInitialLoading) {
    return (
      <div className="flex flex-col gap-3">
        <QualificationCardSkeleton />
        <QualificationCardSkeleton />
        <QualificationCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
        <p>{error instanceof Error ? error.message : "Unable to load qualifications."}</p>
        <Button
          type="button"
          variant="outline"
          size="pill"
          className="mt-4"
          onClick={() => void refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (qualifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-black">No qualifications added yet</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Use the add button above to create your first qualification entry.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {qualifications.map((qualification) => (
        <QualificationCard key={qualification.id} qualification={qualification} />
      ))}

      {hasNextPage ? (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="pill"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading more..." : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
