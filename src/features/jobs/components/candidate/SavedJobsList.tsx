"use client";

import React, { useEffect, useState } from "react";
import { JobListItem } from "@/features/jobs/types/jobs.types";
import CandidateJobCard from "./CandidateJobCard";
import { CustomPagination } from "@/shared/components/CustomPagination";
import { buildSavedJobsPagePath } from "@/features/jobs/utils";

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
  const [visibleJobs, setVisibleJobs] = useState(jobs);
  const [visibleTotal, setVisibleTotal] = useState(totalItems);

  useEffect(() => {
    setVisibleJobs(jobs);
    setVisibleTotal(totalItems);
  }, [jobs, totalItems]);

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
                setVisibleJobs((currentJobs) =>
                  nextSavedState
                    ? currentJobs
                    : currentJobs.filter((currentJob) => currentJob.id !== job.id),
                );
                setVisibleTotal((currentTotal) =>
                  nextSavedState ? currentTotal : Math.max(0, currentTotal - 1),
                );
              }}
            />
          ))
        ) : (
          <div className="border-border text-muted-foreground col-span-full rounded-2xl border border-dashed p-8 text-center">
            No saved jobs found.
          </div>
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
