"use client";

import {
  buildJobsPagePath,
} from "@/features/jobs/utils";
import { JobListItem } from "@/features/jobs/types/jobs.types";
import { JobsSearchFilters } from "@/features/jobs/types/index.types";
import { CustomPagination } from "@/shared/components/CustomPagination";
import CandidateJobCard from "./CandidateJobCard";

type JobsListProps = {
  jobs: JobListItem[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  locale: string;
  filters: JobsSearchFilters;
};

export default function JobsList({
  jobs,
  currentPage,
  totalItems,
  pageSize,
  locale,
  filters,
}: JobsListProps) {
  const buildPageHref = (page: number) =>
    buildJobsPagePath(locale, {
      ...filters,
      page,
    });

  return (
    <>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <CandidateJobCard
              key={job.id}
              job={job}
              href={`/jobs/${job.id}`}
            />
          ))
        ) : (
          <div className="border-border text-muted-foreground col-span-full rounded-2xl border border-dashed p-8 text-center">
            No jobs matched the current search and filters.
          </div>
        )}
      </section>
      {currentPage > 1 || totalItems > pageSize ? (
        <section className="mt-4 w-full">
          <CustomPagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            getHref={buildPageHref}
            onPageChange={() => undefined}
          />
        </section>
      ) : null}
    </>
  );
}
