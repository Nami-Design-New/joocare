import JobActionButtons from "@/features/jobs/components/JobActionButtons";
import JobDescriptionCard from "@/features/jobs/components/JobDescriptionCard";
import JobEducationAndCertificationsCard from "@/features/jobs/components/JobEducationAndCertificationsCard";
import JobHeader from "@/features/jobs/components/JobHeader";
import JobLocationAndSalaryCard from "@/features/jobs/components/JobLocationAndSalaryCard";
import JobOverviewCard from "@/features/jobs/components/JobOverviewCard";
import JobShareCard from "@/features/jobs/components/JobShareCard";
import { getCompanyJobDetails } from "@/features/jobs/services/job-details-service";
import { normalizeJobStatus } from "@/features/jobs/utils";
import Breadcrumb from "@/shared/components/Breadcrumb";
import HttpStatusState from "@/shared/components/HttpStatusState";
import { getHttpStatusCode } from "@/shared/lib/http-error";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  let jobDetails: Awaited<ReturnType<typeof getCompanyJobDetails>>;

  try {
    jobDetails = await getCompanyJobDetails(slug);
  } catch (error) {
    const statusCode = getHttpStatusCode(error);

    if (statusCode && [401, 403, 404, 422, 429, 503].includes(statusCode)) {
      return (
        <HttpStatusState
          statusCode={statusCode}
          error={error}
          primaryHref="/company/job-management"
          primaryLabel="Back to job management"
          secondaryHref="/company/dashboard"
          secondaryLabel="Go to dashboard"
        />
      );
    }

    throw error;
  }

  const job = jobDetails.job;
  const jobTitle = job.title ?? job.job_title?.title ?? "Untitled job";
  const companyName = job.company?.name ?? "Your company";
  const statusLabel = job.current_status?.status ?? job.status;
  const statusDate = job.current_status?.updated_at ?? job.updated_at;

  return (
    <section className="bg-body-bg">
      <section className="pe-3 lg:pe-25">
        <section className="layout-content mt-4 ">
          <JobHeader
            logoSrc={job.company?.image ?? "/assets/comp-logo.svg"}
            title={jobTitle}
            company={companyName}
            employmentType={job.employment_type?.title ?? "Not specified"}
            status={normalizeJobStatus(statusLabel)}
            closingDate={statusDate}
            actions={
              <JobActionButtons
                jobId={job.id}
                candidatesHref={`/company/job/candidates/${job.id}`}
                applicationsCount={job.applications_count}
                currentStatus={normalizeJobStatus(statusLabel)}
                deleteRedirectTo="/company/job-management"
              />
            }
          />

          <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-3">
            <div className="col-span-2 flex flex-col gap-8">
              <JobDescriptionCard job={job} />
            </div>
            <div className="col-span-1 flex flex-col gap-8">
              <JobLocationAndSalaryCard job={job} />
              <JobOverviewCard job={job} />
              <JobEducationAndCertificationsCard job={job} />
              <JobShareCard
                title={jobTitle}
                path={`/jobs/${job.id}`}
              />
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
