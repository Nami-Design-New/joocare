import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import DashboardIcon from './DashboardIcon';
import DashboardWidgetTitle from './DashboardWidgetTitle';

type DashboardAnalyticsCardProps = {
  title: string;
  description: string;
  icon: string;
  iconHeight?: number;
  value: string;
  suffix: string;
  periodSelect: ReactNode;
  children?: ReactNode;
  empty?: boolean;
  isPending?: boolean;
};

export default function DashboardAnalyticsCard({
  title,
  description,
  icon,
  iconHeight = 20,
  value,
  suffix,
  periodSelect,
  children,
  empty,
  isPending,
}: DashboardAnalyticsCardProps) {
  const t = useTranslations('companyPage.dashboard.design');
  return (
    <section className="bg-card flex min-h-56 flex-col gap-1 rounded-2xl p-4 sm:p-6">
      <div className="flex h-9 items-center justify-between gap-2">
        <span className="bg-dashboard-teal/10 flex h-9 w-11 items-center justify-center rounded-xl">
          <DashboardIcon name={icon} width={20} height={iconHeight} />
        </span>
        {periodSelect}
      </div>
      <div className="flex h-8 items-end">
        <DashboardWidgetTitle
          title={title}
          description={description}
          className="text-dashboard-heading"
        />
      </div>
      {isPending ? (
        <Skeleton className="mt-2 h-16 w-3/4" />
      ) : empty ? (
        <EmptyDataState
          titleText={t('no-period-data')}
          description={t('choose-another-period')}
          icon={<span />}
          className="min-h-26 rounded-none p-0 [&_h3]:mt-1 [&_h3]:text-sm [&_p]:text-xs"
        />
      ) : (
        <>
          <div className="flex h-10 flex-wrap items-baseline gap-x-3">
            <p className="text-foreground text-3xl leading-9 font-bold sm:text-[38px] sm:leading-10">
              {value}
            </p>
            <span className="text-dashboard-heading text-sm leading-5">
              {suffix}
            </span>
          </div>
          {children}
        </>
      )}
    </section>
  );
}
