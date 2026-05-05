"use client";

import { useEffect, useRef } from "react";

import CandidateJobCard from "@/features/jobs/components/candidate/CandidateJobCard";
import JobCardSkeleton from "./JobCardSkeleton";
import JobsSectionErrorState from "./JobsSectionErrorState";
import { useInfiniteCompanyJobs } from "../hooks/useInfiniteCompanyJobs";

type JobsSectionsInfiniteProps = {
  slug: string;
  locale: string;
};

export default function JobsSectionsInfinite({
  slug,
  locale,
}: JobsSectionsInfiniteProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  } = useInfiniteCompanyJobs({ slug, locale });

  const additionalJobs = data?.pages.slice(1).flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: "160px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (additionalJobs.length === 0 && !hasNextPage && !isFetchingNextPage) {
    return null;
  }

  if (isFetchNextPageError) {
    return (
      <>
        {additionalJobs.map((job) => (
          <CandidateJobCard
            key={job.id}
            job={job}
            href={`/jobs/${job.id}`}
          />
        ))}
        <JobsSectionErrorState
          error={error}
          onRetry={() => {
            void fetchNextPage();
          }}
        />
      </>
    );
  }

  return (
    <>

      {additionalJobs.length > 0 &&
        additionalJobs.map((job) => (
          <CandidateJobCard
            key={job.id}
            job={job}
            href={`/jobs/${job.id}`}
          />
        ))}

      {isFetchingNextPage &&
        Array.from({ length: 2 }).map((_, i) => (
          <JobCardSkeleton key={`skeleton-${i}`} />
        ))}


      {additionalJobs.length === 0 &&
        !hasNextPage &&
        !isFetchingNextPage &&
        null}

      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
    </>
  );
}
