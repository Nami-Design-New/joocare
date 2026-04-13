"use client";

import { Button } from "@/shared/components/ui/button";
import useGetLicenses from "../../hooks/useGetLicenses";
import CredentialsEmptyState from "../shared/CredentialsEmptyState";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import LicenseCard from "./LicenseCard";
import { LicenseCardSkeletonList } from "./LicenseCardSkeleton";

export default function LicensesContent() {
  const {
    licenses,
    isInitialLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetLicenses();

  if (isInitialLoading) {
    return <LicenseCardSkeletonList />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
        <p>{error instanceof Error ? error.message : "Unable to load licenses."}</p>
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

  if (licenses.length === 0) {
    return (
      <CredentialsEmptyState
        title="No licenses added yet"
        description="Use the add button above to create your first license entry."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {licenses.map((license) => (
          <LicenseCard key={license.id} license={license} />
        ))}
      </div>

      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />
    </>
  );
}
