import React from "react";
import JobOverviewItem from "./JobOverviewItem";

const JobOverviewCard: React.FC = () => {
  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white p-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        Job Overview
      </h2>
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="col-span-2">
          <JobOverviewItem
            label="Experience"
            value="3-5 years"
            icon="/assets/icons/exp.svg"
          />
        </div>
        <JobOverviewItem
          label="Job Category"
          value="Surgeon"
          icon="/assets/icons/job-category.svg"
        />
        <JobOverviewItem
          label="Specialty"
          value="Cardiology"
          icon="/assets/icons/specialty.svg"
        />
        <JobOverviewItem
          label="Role category"
          value="Clinical"
          icon="/assets/icons/role-category.svg"
        />
        <JobOverviewItem
          label="Seniority Level"
          value="Mid Level"
          icon="/assets/icons/seniority.svg"
        />
      </div>
    </div>
  );
};

export default JobOverviewCard;
