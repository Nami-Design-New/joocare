import JobDescriptionCard from "@/features/jobs/components/JobDescriptionCard";
import JobEducationAndCertificationsCard from "@/features/jobs/components/JobEducationAndCertificationsCard";
import JobHeader from "@/features/jobs/components/JobHeader";
import JobLocationAndSalaryCard from "@/features/jobs/components/JobLocationAndSalaryCard";
import JobOverviewCard from "@/features/jobs/components/JobOverviewCard";
import JobShareCard from "@/features/jobs/components/JobShareCard";

export default function JobDetailsPage() {
  return (
    <section>
      <JobHeader
        logoSrc="/assets/comp-logo.svg"
        title="Senior Specialist Physician"
        company="Health care"
        employmentType="FULL-TIME"
        status="open"
        closingDate="21 December 2026, 4:00 AM"
      />

      <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-3">
        <JobDescriptionCard />
        <div className="col-span-1 flex flex-col gap-8">
          <JobLocationAndSalaryCard />
          <JobOverviewCard />
          <JobEducationAndCertificationsCard />
          <JobShareCard />
        </div>
      </div>
    </section>
  );
}
