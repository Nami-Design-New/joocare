import SimilarJobsSection from "@/features/about/components/SimilarJobsSection";
import AboutEmployer from "@/features/jobs/components/candidate/AboutEmployer";
import JobDetailsHeader from "@/features/jobs/components/candidate/JobDetailsHeader";
import JobDescriptionCard from "@/features/jobs/components/JobDescriptionCard";
import JobEducationAndCertificationsCard from "@/features/jobs/components/JobEducationAndCertificationsCard";
import JobLocationAndSalaryCard from "@/features/jobs/components/JobLocationAndSalaryCard";
import JobOverviewCard from "@/features/jobs/components/JobOverviewCard";
import JobShareCard from "@/features/jobs/components/JobShareCard";
import Breadcrumb from "@/shared/components/Breadcrumb";

export default function page() {
  return (
    <section className="">
      <Breadcrumb
        title="Job Details"
        items={[
          { label: "Title", href: "/" },
          { label: "Job Details", href: "" },
        ]}
      />
      <section className="container mx-auto -mt-20 px-3 lg:px-25">
        <JobDetailsHeader />
        <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-3">
          <div className="col-span-2 flex flex-col gap-8">
            <JobDescriptionCard />
            <AboutEmployer />
          </div>
          <div className="col-span-1 flex flex-col gap-8">
            <JobLocationAndSalaryCard />
            <JobOverviewCard />
            <JobEducationAndCertificationsCard />
            <JobShareCard />
          </div>
        </div>
        <SimilarJobsSection />
      </section>{" "}
    </section>
  );
}
