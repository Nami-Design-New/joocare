import CandidateJobCard from "@/features/jobs/components/candidate/CandidateJobCard";
import { JobListItem } from "@/features/jobs/types/jobs.types";
import JobsSectionSkeleton from "./JobsSectionSkeleton";
import JobsSectionErrorState from "./JobsSectionErrorState";
import JobsSectionsInfinite from "./JobsSectionsInfinite";
import EmptyDataState from "@/shared/components/EmptyDataState";

type JobsSectionsProps = {
  slug: string;
  locale: string;
  companyName: string;
  initialJobs: JobListItem[];
  jobsError?: unknown;
};

export function JobsSectionsFallback({ companyName }: { companyName: string }) {
  return <JobsSectionSkeleton companyName={companyName} />;
}

export default function JobsSections({
  slug,
  locale,
  companyName,
  initialJobs,
  jobsError,
}: JobsSectionsProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Jobs from {companyName}</h3>
      </div>

      {jobsError ? (
        <JobsSectionErrorState error={jobsError} />
      ) : initialJobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {initialJobs.map((job) => (
              <CandidateJobCard
                job={job}
                key={job.id}
                href={`/jobs/${job.id}`}
              />
            ))}
            <JobsSectionsInfinite slug={slug} locale={locale} />
          </div>
        </>
      ) : (
        <EmptyDataState description=" No jobs are available for this company right now." />
      )}
    </div>
  );
}
