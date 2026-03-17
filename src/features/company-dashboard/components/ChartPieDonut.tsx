"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "Nursing", value: 25, color: "#4F7CAC" },
  { name: "Physicians", value: 25, color: "#7BAE7F" },
  { name: "Allied Health", value: 50, color: "#F4A259" },
];

const renderInsideLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
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

export function ChartPieDonut() {
  return (
    <div className="flex items-center justify-between pb-0">
      <div className="aspect-square w-full max-w-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              label={renderInsideLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-3 w-3" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
