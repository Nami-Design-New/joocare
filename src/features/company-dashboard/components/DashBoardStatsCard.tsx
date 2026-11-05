import type { ReactNode } from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import DashboardWidgetTitle from './DashboardWidgetTitle';
import DashboardIcon from './DashboardIcon';

type DashBoardStatsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: string;
  suffix?: string;
  comparison?: ReactNode;
  periodSelect?: ReactNode;
  isPending?: boolean;
  compact?: boolean;
};

export default function DashBoardStatsCard({
  title,
  value,
  description,
  icon,
  suffix,
  comparison,
  periodSelect,
  isPending,
  compact = false,
}: DashBoardStatsCardProps) {
  return (
    <section
      className={cn(
        'bg-card relative flex min-h-38.75 flex-col gap-4 rounded-2xl p-6',
        compact && 'bg-dashboard-stat-bg min-h-26.75 justify-center gap-1',
      )}
    >
      {compact ? (
        <h2 className="text-muted-foreground text-base leading-5 font-normal">
          {title}
        </h2>
      ) : (
        <DashboardWidgetTitle title={title} description={description} />
      )}
      {periodSelect && (
        <div className="absolute end-6 top-4.5">{periodSelect}</div>
      )}
      <div className="flex min-h-8.75 items-center gap-2 pe-16">
        {isPending ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-dashboard-primary text-[28px] leading-8.75 font-extrabold">
            <bdi>{value}</bdi>
            <span className="text-secondary ms-1 text-base font-normal">
              {suffix}
            </span>
          </p>
        )}
        {comparison && (
          <div className="text-secondary absolute end-26 bottom-16 text-base leading-5">
            {comparison}
          </div>
        )}
      </div>
      {!compact && (
        <p className="text-muted-foreground mt-auto text-base leading-5">
          {description}
        </p>
      )}
      <DashboardIcon
        name={icon}
        width={48}
        className={cn(
          'absolute end-6 top-13.5',
          compact && 'top-1/2 -translate-y-1/2',
        )}
      />
    </section>
  );
}
