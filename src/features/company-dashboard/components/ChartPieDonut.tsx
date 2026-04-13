"use client";

import TextSkeleton from "@/features/company-profile/components/TextSkeleton";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
const COLORS = ["#4F7CAC", "#7BAE7F", "#F4A259", "#FF8042", "#A28EFF"];

const renderInsideLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;

  // Position label in the middle of the donut ring
  const radius = innerRadius + (outerRadius - innerRadius) / 2;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="fill-white text-xs font-semibold"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

export function ChartPieDonut({ isPending, companyDashboardData }: { isPending?: boolean, companyDashboardData: any }) {
  return (
    <div className="flex items-center justify-between pb-0">
      <div className="aspect-square w-full max-w-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={companyDashboardData?.categories_percentage}
              dataKey="percentage"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              label={renderInsideLabel}
              labelLine={false}
            >
              {companyDashboardData?.categories_percentage.map(
                (_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                )
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {companyDashboardData?.categories_percentage.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="h-3 w-3" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            {isPending ? <TextSkeleton /> : <span className="text-muted-foreground text-sm">{item.category_title}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
