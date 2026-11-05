'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useLocale } from 'next-intl';
import { DASHBOARD_CATEGORY_COLORS } from '../constants/dashboard-preview';
import type { DashboardCategory } from '../index.type';

type ChartLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
};

function renderChartLabel(
  { cx, cy, midAngle, innerRadius, outerRadius, percent }: ChartLabelProps,
  locale: string,
) {
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const radian = Math.PI / 180;
  return (
    <text
      x={cx + radius * Math.cos(-midAngle * radian)}
      y={cy + radius * Math.sin(-midAngle * radian)}
      textAnchor="middle"
      dominantBaseline="central"
      className="fill-primary-foreground text-xs font-semibold"
    >
      {new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 0,
      }).format(percent)}
    </text>
  );
}

export function ChartPieDonut({
  categories,
}: {
  categories: DashboardCategory[];
}) {
  const locale = useLocale();
  const chartCategories = categories.map((category, index) => ({
    ...category,
    color: DASHBOARD_CATEGORY_COLORS[index % DASHBOARD_CATEGORY_COLORS.length],
  }));
  const chartOrder = [
    ...chartCategories.slice(0, 1),
    ...chartCategories.slice(1).reverse(),
  ];
  return (
    <div className="flex min-h-71.5 flex-col items-center gap-6 pt-10">
      <div className="size-41.25 shrink-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartOrder}
              nameKey="category_title"
              dataKey="percentage"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={82}
              startAngle={90}
              endAngle={-270}
              label={(props) => renderChartLabel(props, locale)}
              labelLine={false}
              isAnimationActive={false}
              stroke="var(--card)"
              strokeWidth={1}
            >
              {chartOrder.map((category) => (
                <Cell key={category.category_title} fill={category.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => String(value) + '%'} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
        {categories.map((category, index) => (
          <div
            key={category.category_title}
            className="flex items-center gap-1.5 text-sm leading-4.5 font-semibold"
          >
            <span
              className="size-4 shrink-0"
              style={{
                backgroundColor:
                  DASHBOARD_CATEGORY_COLORS[
                    index % DASHBOARD_CATEGORY_COLORS.length
                  ],
              }}
            />
            <bdi>{category.category_title}</bdi>
          </div>
        ))}
      </div>
    </div>
  );
}
