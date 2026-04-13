import { ChartPieDonut } from "./ChartPieDonut";

export default function PieChartCard({
  className = "",
  companyDashboardData,
  isPending,
}: {
  className?: string;
  companyDashboardData: any;
  isPending?: boolean;
}) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-xl bg-white p-6 ${className}`}
    >
      <h5 className="text-foreground text-xl font-semibold">
        Category Breakdown
      </h5>
      <ChartPieDonut isPending={isPending} companyDashboardData={companyDashboardData} />
    </section>
  );
}
