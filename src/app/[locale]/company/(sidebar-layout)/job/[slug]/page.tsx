import JobActionButtons from "@/features/jobs/components/JobActionButtons";
import JobDescriptionCard from "@/features/jobs/components/JobDescriptionCard";
import JobEducationAndCertificationsCard from "@/features/jobs/components/JobEducationAndCertificationsCard";
import JobHeader from "@/features/jobs/components/JobHeader";
import JobLocationAndSalaryCard from "@/features/jobs/components/JobLocationAndSalaryCard";
import JobOverviewCard from "@/features/jobs/components/JobOverviewCard";
import JobShareCard from "@/features/jobs/components/JobShareCard";
import { getCompanyJobDetails } from "@/features/jobs/services/job-details-service";
import { normalizeJobStatus } from "@/features/jobs/utils";
import HttpStatusState from "@/shared/components/HttpStatusState";
import { getHttpStatusCode } from "@/shared/lib/http-error";
import { getTranslations } from "next-intl/server";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const t = await getTranslations();
  const { locale, slug } = await params;
  let jobDetails: Awaited<ReturnType<typeof getCompanyJobDetails>>;

  try {
    jobDetails = await getCompanyJobDetails(slug, locale);
  } catch (error) {
    const statusCode = getHttpStatusCode(error);

    if (statusCode && [401, 403, 404, 422, 429, 503].includes(statusCode)) {
      return (
        <HttpStatusState
          statusCode={statusCode}
          error={error}
          primaryHref="/company/job-management"
          primaryLabel={t("companyPage.jobDetails.back-to-job-management")}
          secondaryHref="/company/dashboard"
          secondaryLabel={t("companyPage.jobDetails.go-to-dashboard")}
        />
      );
    }

    throw error;
  }

  const job = jobDetails.job;
  const jobTitle = job.title ?? job.job_title?.title ?? t("companyPage.jobDetails.untitled-job");
  const companyName = job.company?.name ?? t("companyPage.jobDetails.your-company");
  const statusLabel = job.current_status?.status ?? job.status;
  const statusDate = job.current_status?.updated_at ?? job.updated_at;

  return (
    <section className="bg-body-bg">
      <section className="">
        <section className="layout-content mt-4">
          <JobHeader
            logoSrc={job.company?.image ?? "/assets/new-logo-dot.svg"}
            title={jobTitle}
            company={companyName}
            employmentType={job.employment_type?.title ?? t("jobsPage.not-specified")}
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

          <div className="grid grid-cols-1 max-xl:gap-y-5 xl:gap-5 pt-7 xl:grid-cols-3">
            <div className="col-span-2 flex flex-col gap-8">
              <JobDescriptionCard job={job} />
            </div>
            <div className="col-span-1 flex flex-col gap-8 max-xl:order-first">
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
