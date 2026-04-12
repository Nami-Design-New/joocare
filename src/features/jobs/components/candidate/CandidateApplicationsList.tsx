"use client";

import { CandidateApplicationItem } from "@/features/jobs/types/jobs.types";
import { buildCandidateApplicationsPagePath } from "@/features/jobs/utils";
import { CustomPagination } from "@/shared/components/CustomPagination";
import EmptyDataState from "@/shared/components/EmptyDataState";
import CandidateJobCard from "./CandidateJobCard";

type CandidateApplicationsListProps = {
  applications: CandidateApplicationItem[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  locale: string;
};

export default function CandidateApplicationsList({
  applications,
  currentPage,
  totalItems,
  pageSize,
  locale,
}: CandidateApplicationsListProps) {
  const buildPageHref = (page: number) =>
    buildCandidateApplicationsPagePath(locale, page);

  return (
    <>
      <section className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
        {applications.length > 0 ? (
          applications.map((application) => (
            <CandidateJobCard
              key={application.id}
              job={application.job}
              href={`/jobs/${application.job.id}`}
              appliedBadge
              appliedAtLabel={application.created_at}
            />
          ))
        ) : (
          <EmptyDataState
            title="No Data"
            description="You have not submitted any applications yet."
          />
        )}
      </section>

      {currentPage > 1 || totalItems > pageSize ? (
        <section className="mt-4 w-full">
          <CustomPagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={() => undefined}
            getHref={buildPageHref}
          />
        </section>
      ) : null}
    </>
  );
}
