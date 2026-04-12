import SimilarJobsSection from "@/features/about/components/SimilarJobsSection";
import AboutEmployer from "@/features/jobs/components/candidate/AboutEmployer";
import JobDetailsHeader from "@/features/jobs/components/candidate/JobDetailsHeader";
import JobDescriptionCard from "@/features/jobs/components/JobDescriptionCard";
import JobEducationAndCertificationsCard from "@/features/jobs/components/JobEducationAndCertificationsCard";
import JobLocationAndSalaryCard from "@/features/jobs/components/JobLocationAndSalaryCard";
import JobOverviewCard from "@/features/jobs/components/JobOverviewCard";
import JobShareCard from "@/features/jobs/components/JobShareCard";
import { getJobDetails } from "@/features/jobs/services/job-details-service";
import Breadcrumb from "@/shared/components/Breadcrumb";
import HttpStatusState from "@/shared/components/HttpStatusState";
import { getHttpStatusCode } from "@/shared/lib/http-error";

export default async function page({
  params
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {

  const { slug } = await params
  let jobDetails;

  try {
    jobDetails = await getJobDetails(slug)
  } catch (error) {
    const statusCode = getHttpStatusCode(error);

    if (statusCode && [401, 403, 404, 422, 429, 503].includes(statusCode)) {
      return (
        <HttpStatusState
          statusCode={statusCode}
          error={error}
          primaryHref="/jobs"
          primaryLabel="Browse jobs"
          secondaryHref="/"
          secondaryLabel="Back to home"
        />
      );
    }

    throw error;
  }

  return (
    <section className="bg-body-bg">
      <Breadcrumb
        title="Job Details"
        items={[
          { label: "Title", href: "/" },
          { label: "Job Details", href: "" },
        ]}
      />
      <section className="px-3 lg:px-25">
        <section className="container mx-auto mt-4 lg:-mt-20">
          <JobDetailsHeader job={jobDetails?.job} />
          <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-3">
            <div className="col-span-2 flex flex-col gap-8">
              <JobDescriptionCard job={jobDetails?.job} />
              <AboutEmployer employer={jobDetails?.job?.company} />
            </div>
            <div className="col-span-1 flex flex-col gap-8">
              <JobLocationAndSalaryCard job={jobDetails.job} />
              <JobOverviewCard job={jobDetails.job} />
              <JobEducationAndCertificationsCard job={jobDetails.job} />
              <JobShareCard
                title={jobDetails?.job?.title ?? jobDetails?.job?.job_title?.title}
              />
            </div>
          </div>
          <SimilarJobsSection jobs={jobDetails.similar_jobs} />
        </section>{" "}
      </section>
    </section>
  );
}
