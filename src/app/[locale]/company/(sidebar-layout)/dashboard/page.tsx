import ActiveJobsTable from "@/features/company-dashboard/components/ActiveJobsTable";
import DashBoardStatsCard from "@/features/company-dashboard/components/DashBoardStatsCard";
import PieChartCard from "@/features/company-dashboard/components/PieChartCard";
import { activeJobType } from "@/features/company-dashboard/index.type";
import Image from "next/image";

const MOCK_ACTIVE_JOBS: activeJobType[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  jobTitle: "Consultant Internist",
  jobViews: 12,
  applicants: 2,
  postedSince: "21 December 2026",
  cvUrl: "/cv/applicant.pdf",
}));

const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <h1 className="text-foreground text-xl font-semibold">Active Jobs</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {/* Top 3 stats cards */}
        <div className="col-span-1">
          <DashBoardStatsCard
            title="Active job postings"
            primaryValue="+12"
            description="Current active job postings"
            icon={
              <Image
                src="/assets/icons/mic.svg"
                width={48}
                height={48}
                alt="mic icon"
              />
            }
          />
        </div>
        <div className="col-span-1">
          <DashBoardStatsCard
            title="Total Application Volume"
            primaryValue="327"
            addState={{ label: "this week", value: "+12" }}
            description="Total applications across all jobs"
            icon={
              <Image
                src="/assets/icons/users.svg"
                width={48}
                height={48}
                alt="users group icon"
              />
            }
          />
        </div>{" "}
        <div className="col-span-1">
          <DashBoardStatsCard
            title="Latest Activity"
            primaryValue="+12"
            badge={{ label: "Application" }}
            description="2 hours ago"
            icon={
              <Image
                src="/assets/icons/arrow-target.svg"
                width={48}
                height={48}
                alt="arrow target icon"
              />
            }
          />
        </div>
        {/* Left column stacked: Talant intake + Pie chart */}
        <div className="xl:col-start-1 xl:row-start-2 xl:row-end-3">
          <DashBoardStatsCard
            title="Talant intake"
            primaryValue="320"
            description="CVs downloaded"
            icon={
              <Image
                src="/assets/icons/double-check.svg"
                width={48}
                height={48}
                alt="Double Check icon"
              />
            }
          />
        </div>
        <PieChartCard className="lg:col-span-2 lg:col-start-1 lg:row-start-3 xl:col-span-1 xl:row-start-3 xl:row-end-4" />
        {/* Right column table spanning 2 columns */}
        <div className="lg:col-span-2 lg:row-start-4 xl:col-span-2 xl:col-start-2 xl:row-start-2 xl:row-end-4">
          <ActiveJobsTable activeJobs={MOCK_ACTIVE_JOBS} />
        </div>
      </div>
    </section>
  );
};
export default DashboardPage;
