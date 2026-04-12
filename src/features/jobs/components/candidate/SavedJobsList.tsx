"use client";

import { useState } from "react";
import { JobListItem } from "@/features/jobs/types/jobs.types";
import CandidateJobCard from "./CandidateJobCard";
import { CustomPagination } from "@/shared/components/CustomPagination";
import { buildSavedJobsPagePath } from "@/features/jobs/utils";
import EmptyDataState from "@/shared/components/EmptyDataState";

type SavedJobsListProps = {
  jobs: JobListItem[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  locale: string;
};

export default function SavedJobsList({
  jobs,
  currentPage,
  totalItems,
  pageSize,
  locale,
}: SavedJobsListProps) {
  const [removedJobIds, setRemovedJobIds] = useState<number[]>([]);
  const visibleJobs = jobs.filter((job) => !removedJobIds.includes(job.id));
  const visibleTotal = Math.max(0, totalItems - removedJobIds.length);

  const buildPageHref = (page: number) => buildSavedJobsPagePath(locale, page);

  return (
    <section className="my-11">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {visibleJobs.length > 0 ? (
          visibleJobs.map((job) => (
            <CandidateJobCard
              key={job.id}
              job={job}
              href={`/jobs/${job.id}`}
              onSavedChange={(nextSavedState) => {
                setRemovedJobIds((currentIds) =>
                  nextSavedState || currentIds.includes(job.id)
                    ? currentIds
                    : [...currentIds, job.id],
                );
              }}
            />
          ))
        ) : (
          <EmptyDataState
            title="No Data"
            description="You have not saved any jobs yet."
          />
        )}
      </section>
      {currentPage > 1 || visibleTotal > pageSize ? (
        <section className="mt-4 w-full">
        <CustomPagination
          currentPage={currentPage}
          totalItems={visibleTotal}
          pageSize={pageSize}
          onPageChange={() => undefined}
          getHref={buildPageHref}
        />
        </section>
      ) : null}
    </section>
  );
}
