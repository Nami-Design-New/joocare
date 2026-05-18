import React from "react";
import JobOverviewItem from "../JobOverviewItem";
import { JobDetails } from "../../types/jobs.types";
import { getTranslations } from "next-intl/server";

export default async function JobOverviewCard({ job }: { job: JobDetails }) {
  // console.log("job overivew card::", job);
  const t = await getTranslations();

  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white py-8 px-6">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        {t("jobDetailsPage.job-overview")}
      </h2>
      <div className="grid grid-cols-2 gap-6 px-4">
        <div className="col-span-2">
          <JobOverviewItem
            label={t("jobsPage.filters.experience")}
            value={job?.experience?.title ?? job?.experience_title ?? t("jobsPage.not-specified")}
            icon="/assets/icons/exp.svg"
          />
        </div>
        <JobOverviewItem
          label={t("jobDetailsPage.job-category")}
          value={job?.category?.title ?? job?.category_title ?? t("jobsPage.not-specified")}
          icon="/assets/icons/job-category.svg"
        />
        <JobOverviewItem
          label={t("jobDetailsPage.specialty")}
          value={job?.specialty?.title ?? job?.specialty_title ?? t("jobsPage.not-specified")}
          icon="/assets/icons/specialty.svg"
        />
        <JobOverviewItem
          label={t("jobsPage.filters.role-category")}
          value={job?.role_category?.title ?? t("jobsPage.not-specified")}
          icon="/assets/icons/role-category.svg"
        />
        <JobOverviewItem
          label={t("jobsPage.filters.seniority-level")}
          value={job?.seniority_level?.title ?? t("jobsPage.not-specified")}
          icon="/assets/icons/seniority.svg"
        />
      </div>
    </div>
  );
}

