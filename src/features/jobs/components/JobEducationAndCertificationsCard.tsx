import Image from "next/image";
import { JobDetails } from "../types/jobs.types";
import JobOverviewItem from "./JobOverviewItem";
import { getTranslations } from "next-intl/server";

export default async function JobEducationAndCertificationsCard({ job }: { job: JobDetails }) {
  const t = await getTranslations();
  const availability = job.availability?.title ?? job.availability_title ?? t("jobsPage.not-specified");

  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white p-4 md:p-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        {t("jobDetailsPage.education-certifications")}
      </h2>
      <div className="flex flex-col gap-6">
        <JobOverviewItem
          label={t("jobDetailsPage.education-level")}
          value={job.education_levels}
          icon="/assets/icons/exp.svg"
        />
        <div>
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/case.svg"
                width={20}
                height={20}
                alt={t("jobDetailsPage.icon")}
              />
              <p className="text-muted-foreground text-sm md:text-base">
                {t("jobDetailsPage.mandatory-certifications")}
              </p>
            </div>
            <div>
              <ul className="mt-2 flex flex-col gap-2">
                {
                  job.mandatory_certifications.map((item) =>
                    <li className="edu-certificate" key={item?.id}>
                      {item.title ?? item.mandatory_certification?.title ?? "-"}
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
        <JobOverviewItem
          label={t("jobsPage.filters.availability")}
          value={availability}
          icon="/assets/icons/case.svg"
        />
      </div>{" "}
    </div>
  );
}
