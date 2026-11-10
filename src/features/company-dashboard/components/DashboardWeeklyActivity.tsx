'use client';

import { useId } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import {
  weeklyActivityDays,
  weeklyActivityPreview,
} from '../constants/active-jobs-preview';
import DashboardIcon from './DashboardIcon';

export default function DashboardWeeklyActivity() {
  const t = useTranslations('companyPage.dashboard.active-jobs-page');
  const locale = useLocale();
  const gradientId = 'activity-fill-' + useId().replaceAll(':', '');
  const number = new Intl.NumberFormat(locale, { useGrouping: false });
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: 'UTC',
  });

  return (
    <section className="bg-card rounded-xl p-3">
      <h2 className="text-foreground flex items-center gap-1.25 text-[13.5px] leading-4.25 font-semibold">
        <DashboardIcon name="weekly-activity" width={15.5} />
        {t('weekly-activity')}
      </h2>
      <ChartContainer
        dir="ltr"
        className="mt-2.25 aspect-auto h-79.25 w-full"
        config={{
          value: {
            label: t('weekly-activity'),
            color: 'var(--dashboard-primary)',
          },
        }}
        role="img"
        aria-label={t('chart-description')}
      >
        <AreaChart
          data={weeklyActivityPreview}
          margin={{ top: 10, right: 6, bottom: 6, left: 0 }}
          accessibilityLayer
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--dashboard-activity-fill)"
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor="var(--dashboard-activity-fill)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="1 2"
            verticalCoordinatesGenerator={({ xAxis }) =>
              weeklyActivityPreview.map(({ position }) => xAxis.scale(position))
            }
          />
          <XAxis
            type="number"
            dataKey="position"
            domain={[0, weeklyActivityPreview.length - 1]}
            ticks={weeklyActivityDays.map((day) => day.position)}
            tickFormatter={(position: number) => {
              const day = weeklyActivityDays.find(
                (day) => day.position === position,
              );
              return day ? weekday.format(day.date) : '';
            }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            tick={{ fontSize: 10.5 }}
            height={20}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value: number) => number.format(value)}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            tick={{ fontSize: 10.5 }}
            width={30}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Area
            type="linear"
            dataKey="value"
            stroke="var(--dashboard-primary)"
            strokeWidth={0.8}
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            dot={{ r: 2.5, fill: 'var(--card)', strokeWidth: 0.8 }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
