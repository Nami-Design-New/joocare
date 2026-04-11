import React from "react";
import JobOverviewItem from "./JobOverviewItem";
import { JobDetails } from "../types/jobs.types";

export default function JobOverviewCard({ job }: { job: JobDetails }) {
  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white p-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        Job Overview
      </h2>
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="col-span-2">
          <JobOverviewItem
            label="Experience"
            value={job.eduction_level.title}
            icon="/assets/icons/exp.svg"
          />
        </div>
        <JobOverviewItem
          label="Job Category"
          value={job.category.title}
          icon="/assets/icons/job-category.svg"
        />
        <JobOverviewItem
          label="Specialty"
          value={job.specialty.title}
          icon="/assets/icons/specialty.svg"
        />
        <JobOverviewItem
          label="Role category"
          value={job.role_category.title}
          icon="/assets/icons/role-category.svg"
        />
        <JobOverviewItem
          label="Seniority Level"
          value={job.seniority_level.title}
          icon="/assets/icons/seniority.svg"
        />
      </div>
    </div>
  );
};

