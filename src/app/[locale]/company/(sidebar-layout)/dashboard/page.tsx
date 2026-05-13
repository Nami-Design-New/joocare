"use client"

import ActiveJobsTable from "@/features/company-dashboard/components/ActiveJobsTable";
import DashBoardStatsCard from "@/features/company-dashboard/components/DashBoardStatsCard";
import PieChartCard from "@/features/company-dashboard/components/PieChartCard";
import useGetCompanyDashboard from "@/features/company-dashboard/hooks/useGetCompanyDashboard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const DashboardPage = () => {
  const t = useTranslations();
  const { data: session } = useSession();
  const token = session?.accessToken as string
  const { data: companyDashboardData, isPending } = useGetCompanyDashboard({ token });
  // console.log("companydashboard data", companyDashboardData);

  return (
    <section className="space-y-6">
      <h1 className="text-foreground text-xl font-semibold">{t("companyPage.dashboard.active-jobs-title")}</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {/* Top 3 stats cards */}
        <div className="col-span-1">
          <DashBoardStatsCard
            isPending={isPending}
            title={t("companyPage.dashboard.cards.active-job-postings.title")}
            primaryValue={`+${Number(companyDashboardData?.active_jobs)}`}
            description={t("companyPage.dashboard.cards.active-job-postings.description")}
            icon={
              <Image
                src="/assets/icons/mic.svg"
                width={48}
                height={48}
                alt={t("companyPage.dashboard.icons.mic-alt")}
              />
            }
          />
        </div>
        <div className="col-span-1">
          <DashBoardStatsCard
            isPending={isPending}
            title={t("companyPage.dashboard.cards.total-application-volume.title")}
            primaryValue={Number(companyDashboardData?.total_applications)}
            addState={{ label: t("companyPage.dashboard.cards.total-application-volume.this-week"), value: `+${Number(companyDashboardData?.applications_this_week)}` }}
            description={t("companyPage.dashboard.cards.total-application-volume.description")}
            icon={
              <Image
                src="/assets/icons/users.svg"
                width={48}
                height={48}
                alt={t("companyPage.dashboard.icons.users-alt")}
              />
            }
          />
        </div>{" "}
        <div className="col-span-1">
          <DashBoardStatsCard
            isPending={isPending}
            title={t("companyPage.dashboard.cards.latest-activity.title")}
            primaryValue={`+${Number(companyDashboardData?.applications_latest_activity)}`}
            badge={{ label: t("companyPage.dashboard.cards.latest-activity.badge") }}
            description={t("companyPage.dashboard.cards.latest-activity.description")}
            icon={
              <Image
                src="/assets/icons/arrow-target.svg"
                width={48}
                height={48}
                alt={t("companyPage.dashboard.icons.arrow-target-alt")}
              />
            }
          />
        </div>
        {/* Left column stacked: Talant intake + Pie chart */}
        <div className="xl:col-start-1 xl:row-start-2 xl:row-end-3">
          <DashBoardStatsCard
            isPending={isPending}
            title={t("companyPage.dashboard.cards.talent-intake.title")}
            primaryValue={`${Number(companyDashboardData?.cvs_downloaded)}`}
            description={t("companyPage.dashboard.cards.talent-intake.description")}
            icon={
              <Image
                src="/assets/icons/double-check.svg"
                width={48}
                height={48}
                alt={t("companyPage.dashboard.icons.double-check-alt")}
              />
            }
          />
        </div>
        <PieChartCard
          isPending={isPending}
          companyDashboardData={companyDashboardData}
          className="lg:col-span-2 lg:col-start-1 lg:row-start-3 xl:col-span-1 xl:row-start-3 xl:row-end-4" />
        {/* Right column table spanning 2 columns */}
        <div className="lg:col-span-2 lg:row-start-4 xl:col-span-2 xl:col-start-2 xl:row-start-2 xl:row-end-4">
          <ActiveJobsTable />
        </div>
      </div>
    </section >
  );
};
export default DashboardPage;
