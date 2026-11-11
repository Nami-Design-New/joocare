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
        'relative flex min-h-38.75 flex-col gap-4 rounded-2xl bg-card p-4 sm:p-6',
        compact && 'min-h-26.75 justify-center gap-1 bg-dashboard-stat-bg',
      )}
    >
      {compact ? (
        <h2 className="text-base leading-5 font-normal text-muted-foreground">
          {title}
        </h2>
      ) : (
        <DashboardWidgetTitle title={title} description={description} />
      )}
      {periodSelect && (
        <div className="absolute end-4 top-4.5 sm:end-6">{periodSelect}</div>
      )}
      <div className="flex min-h-8.75 items-center gap-2 pe-16">
        {isPending ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-2xl leading-8.75 font-extrabold text-dashboard-primary sm:text-[28px]">
            <bdi>{value}</bdi>
            <span className="ms-1 text-base font-normal text-secondary">
              {suffix}
            </span>
          </p>
        )}
        {comparison && (
          <div className="absolute end-26 bottom-16 text-base leading-5 text-secondary">
            {comparison}
          </div>
        )}
      </div>
      {!compact && (
        <p className="mt-auto text-base leading-5 text-muted-foreground">
          {description}
        </p>
      )}
      <DashboardIcon
        name={icon}
        width={48}
        className={cn(
          'absolute end-4 top-13.5 sm:end-6',
          compact && 'top-1/2 -translate-y-1/2',
        )}
      />
    </section>
  );
}
