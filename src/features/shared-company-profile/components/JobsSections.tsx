import CandidateJobCard from "@/features/jobs/components/candidate/CandidateJobCard";
import { JobListItem } from "@/features/jobs/types/jobs.types";
import JobsSectionSkeleton from "./JobsSectionSkeleton";
import JobsSectionsInfinite from "./JobsSectionsInfinite";

type JobsSectionsProps = {
  slug: string;
  locale: string;
  companyName: string;
  initialJobs: JobListItem[];
};

export function JobsSectionsFallback({ companyName }: { companyName: string }) {
  return <JobsSectionSkeleton companyName={companyName} />;
}

export default function JobsSections({
  slug,
  locale,
  companyName,
  initialJobs,
}: JobsSectionsProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Jobs from {companyName}</h3>
      </div>

      {initialJobs.length > 0 ? (
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
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No jobs are available for this company right now.
        </div>
      )}
    </div>
  );
}
