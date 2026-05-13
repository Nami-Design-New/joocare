"use client";

import { ChartPieDonut } from "./ChartPieDonut";
import { useTranslations } from "next-intl";

export default function PieChartCard({
  className = "",
  companyDashboardData,
  isPending,
}: {
  className?: string;
  companyDashboardData: any;
  isPending?: boolean;
}) {
  const t = useTranslations();
  return (
    <section
      className={`flex flex-col gap-4 rounded-xl bg-white p-6 ${className}`}
    >
      <h5 className="text-foreground text-xl font-semibold">
        {t("companyPage.dashboard.category-breakdown")}
      </h5>
      <ChartPieDonut isPending={isPending} companyDashboardData={companyDashboardData} />
    </section>
  );
}
