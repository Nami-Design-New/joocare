import JobsFilterSection from "@/features/jobs/components/candidate/JobsFilterSection";
import JobsList from "@/features/jobs/components/candidate/JobsList";
import JobsSideBarFilter from "@/features/jobs/components/candidate/JobsSideBarFilter";
import Breadcrumb from "@/shared/components/Breadcrumb";
import React from "react";

export default function page() {
  return (
    <section>
      <Breadcrumb
        title="Jobs"
        items={[
          { label: "Home", href: "/" },
          { label: "Jobs", href: "/jobs" },
        ]}
      />
      <JobsFilterSection />
      <section className="px-3 lg:px-25">
        <section className="container mx-auto">
          <section className="mt-6 rounded-2xl bg-white p-4">
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-1">
                <JobsSideBarFilter />
              </div>
              <div className="col-span-3">
                <JobsList />
              </div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}
