import { ChartPieDonut } from "./ChartPieDonut";

export default function PieChartCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-xl bg-white p-6 ${className}`}
    >
      <h5 className="text-foreground text-xl font-semibold">
        Category Breakdown
      </h5>
      <ChartPieDonut />
    </section>
  );
}
