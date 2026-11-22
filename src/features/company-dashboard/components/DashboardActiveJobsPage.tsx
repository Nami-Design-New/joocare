'use client';

import { useLocale, useTranslations } from 'next-intl';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { useActiveJobsPage } from '../hooks/useActiveJobsPage';
import { formatDashboardNumber } from '../utils/dashboard-format';
import type { StatisticsOverview } from '../index.type';
import ActiveJobsTable from './ActiveJobsTable';
import DashBoardStatsCard from './DashBoardStatsCard';
import DashboardWeeklyActivity from './DashboardWeeklyActivity';

const OVERVIEW_STATS = [
  { key: 'total-jobs', field: 'total_jobs', icon: 'active-jobs' },
  { key: 'active-jobs', field: 'active_jobs', icon: 'activity' },
  {
    key: 'total-applicants',
    field: 'total_applications',
    icon: 'applications',
  },
  { key: 'total-job-views', field: 'total_views', icon: 'total-job-views' },
] as const satisfies readonly {
  key: string;
  field: keyof StatisticsOverview;
  icon: string;
}[];

type DashboardActiveJobsPageProps = { designPreview?: boolean };

export default function DashboardActiveJobsPage({
  designPreview = false,
}: DashboardActiveJobsPageProps) {
  const t = useTranslations('companyPage.dashboard.active-jobs-page');
  const tDesign = useTranslations('companyPage.dashboard.design');
  const locale = useLocale();
  const page = useActiveJobsPage(designPreview);
  const overview = page.overview;

  if (page.overviewError)
    return (
      <RouteErrorFallback
        error={page.overviewLoadError ?? new Error(t('error-description'))}
        reset={page.retryOverview}
        title={t('error-title')}
        description={t('error-description')}
        retryLabel={tDesign('retry')}
      />
    );

  return (
    <div className="mx-auto space-y-6">
      <section className="space-y-6 rounded-2xl bg-card p-4">
        <h1 className="text-[21px] leading-6.5 font-semibold text-foreground">
          {t('title')}
        </h1>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {OVERVIEW_STATS.map((stat) => (
            <DashBoardStatsCard
              key={stat.key}
              title={t(stat.key)}
              description={t(stat.key)}
              value={
                overview
                  ? '+' + formatDashboardNumber(overview[stat.field], locale)
                  : tDesign('no-data')
              }
              icon={stat.icon}
              isPending={page.overviewLoading}
              compact
            />
          ))}
        </div>
      </section>
      <ActiveJobsTable jobs={page.jobs} title={t('title')} centerActions />
      <DashboardWeeklyActivity
        days={overview?.jobs_per_day ?? []}
        isPending={page.overviewLoading}
      />
    </div>
  );
}
