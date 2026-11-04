import { getTranslations } from "next-intl/server";
import { JobDetails } from "../types/jobs.types";
import DescriptionSection from "./DescriptionSection";
import ItemList from "./ItemList";
import JobAttachmentsCard from "./JobAttachmentsCard";
import JobPostedByCard from "./JobPostedByCard";

export default async function JobDescriptionCard({ job }: { job: JobDetails }) {
  const t = await getTranslations();

  return (
    <div className="card font-noto-sans col-span-2 rounded-2xl bg-body-bg p-7 text-foreground">
      <h3 className="text-primary mb-4 text-xl font-bold">{t("jobDetailsPage.job-description")}</h3>

      <DescriptionSection title={t("jobDetailsPage.qualifications")}>
        <div
          className="prose prose-sm max-w-none border-b pb-5"
          dangerouslySetInnerHTML={{
            __html:
              job.description ||
              `<p>${t("jobDetailsPage.no-description-available")}</p>`,
          }}
        />
      </DescriptionSection>

      <div>
        <h3 className="text-primary font-outfit text-xl font-bold">{t("jobDetailsPage.skills")}</h3>
        <ItemList items={job?.skills} variant="dashed" />
      </div>

      <div className="mt-6 flex flex-col gap-4 empty:hidden">
        <JobAttachmentsCard questions={job.screening_questions} assessment={job.assessment} />
        {job.created_by ? (
          <JobPostedByCard creator={job.created_by} createdAt={job.created_at} />
        ) : null}
      </div>
    </div>
  );
}
