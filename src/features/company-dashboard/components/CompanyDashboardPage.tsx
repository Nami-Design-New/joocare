'use client';

import { useLocale, useTranslations } from 'next-intl';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { useCompanyDashboard } from '../hooks/useCompanyDashboard';
import {
  formatDashboardNumber,
  formatGrowthRate,
} from '../utils/dashboard-format';
import type { DashboardPeriodKey } from '../index.type';
import DashboardReportsBanner from './DashboardReportsBanner';
import DashBoardStatsCard from './DashBoardStatsCard';
import DashboardPeriodSelect from './DashboardPeriodSelect';
import DashboardAnalyticsCard from './DashboardAnalyticsCard';
import DashboardTimeToFill from './DashboardTimeToFill';
import DashboardMetricChange from './DashboardMetricChange';
import PieChartCard from './PieChartCard';
import DashboardHiringAlerts from './DashboardHiringAlerts';
import ActiveJobsTable from './ActiveJobsTable';
import DashboardRecruitersChart from './DashboardRecruitersChart';

type CompanyDashboardPageProps = { designPreview?: boolean };

export default function CompanyDashboardPage({
  designPreview = false,
}: CompanyDashboardPageProps) {
  const t = useTranslations('companyPage.dashboard.design');
  const locale = useLocale();
  const dashboard = useCompanyDashboard(designPreview);
  const data = dashboard.data;
  const number = (value: number | undefined, compact = false) =>
    value === undefined
      ? t('no-data')
      : formatDashboardNumber(value, locale, compact);
  const periodSelect = (key: DashboardPeriodKey, title: string) => (
    <DashboardPeriodSelect
      value={dashboard.periods[key]}
      label={title}
      onChange={(value) => dashboard.changePeriod(key, value)}
    />
  );
  const lastActivity = data?.recent_activity.last_activity_at;

  if (dashboard.error)
    return (
      <RouteErrorFallback
        error={dashboard.loadError ?? new Error(t('error-description'))}
        reset={() => void dashboard.retry()}
        title={t('error-title')}
        description={t('error-description')}
        retryLabel={t('retry')}
      />
    );

  return (
    <div className="mx-auto">
      <section className="space-y-6 py-4">
        <h1 className="text-[21px] leading-6.5 font-semibold text-foreground">
          {t('title')}
        </h1>
        <DashboardReportsBanner />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:[&>section:last-child]:col-span-2 xl:[&>section:last-child]:col-span-1">
          <DashBoardStatsCard
            title={t('active-jobs-title')}
            value={
              data === undefined ? t('no-data') : '+' + number(data.active_jobs)
            }
            description={t('active-jobs-description')}
            icon="active-jobs"
            isPending={dashboard.loading}
          />
          <DashBoardStatsCard
            title={t('applications-title')}
            value={number(data?.total_applications.value)}
            description={t('applications-description')}
            icon="applications"
            isPending={dashboard.isPeriodPending('applications')}
            periodSelect={periodSelect('applications', t('applications-title'))}
            comparison={
              data && (
                <>
                  <strong>
                    <bdi>
                      {formatGrowthRate(
                        data.total_applications.growth_rate,
                        locale,
                      )}
                    </bdi>
                  </strong>{' '}
                  {t('versus-period', {
                    period: data.total_applications.previous_month_label,
                  })}
                </>
              )
            }
          />
          <DashBoardStatsCard
            title={t('activity-title')}
            value={
              data === undefined
                ? t('no-data')
                : '+' + number(data.recent_activity.count_today)
            }
            suffix={t('application-unit')}
            description={
              lastActivity
                ? t('last-activity', { date: lastActivity })
                : t('activity-today')
            }
            icon="activity"
            isPending={dashboard.loading}
          />
        </div>
      </section>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:[&>section:last-child]:col-span-2 xl:[&>section:last-child]:col-span-1">
          <DashboardAnalyticsCard
            title={t('time-title')}
            description={t('time-description')}
            icon="time-to-fill"
            value={t('time-days', {
              days: data?.job_duration.average_days ?? 0,
            })}
            suffix={t('average-time-close')}
            periodSelect={periodSelect('duration', t('time-title'))}
            isPending={dashboard.isPeriodPending('duration')}
            empty={!data || data.job_duration.closed_jobs_count === 0}
          >
            <DashboardTimeToFill days={data?.job_duration.average_days ?? 0} />
          </DashboardAnalyticsCard>
          <DashboardAnalyticsCard
            title={t('reach-title')}
            description={t('reach-description')}
            icon="brand-reach"
            iconHeight={12}
            value={number(data?.user_visits.value, true)}
            suffix={t('unique-profile-viewers')}
            periodSelect={periodSelect('visits', t('reach-title'))}
            isPending={dashboard.isPeriodPending('visits')}
            empty={!data}
          >
            {data && (
              <DashboardMetricChange
                change={data.user_visits.growth_rate}
                previousPeriodLabel={data.user_visits.previous_month_label}
              />
            )}
          </DashboardAnalyticsCard>
          <DashboardAnalyticsCard
            title={t('intake-title')}
            description={t('intake-description')}
            icon="talent-intake"
            value={number(data?.cv_downloads.value)}
            suffix={t('cvs-downloaded')}
            periodSelect={periodSelect('cvDownloads', t('intake-title'))}
            isPending={dashboard.isPeriodPending('cvDownloads')}
            empty={!data}
          >
            {data && (
              <DashboardMetricChange
                change={data.cv_downloads.growth_rate}
                previousPeriodLabel={data.cv_downloads.previous_month_label}
              />
            )}
          </DashboardAnalyticsCard>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <PieChartCard
            categories={data?.categories_percentage ?? []}
            isPending={dashboard.loading}
          />
          <DashboardHiringAlerts
            staleJobs={data?.stale_jobs}
            isPending={dashboard.loading}
          />
        </div>
        <ActiveJobsTable designPreview={designPreview} />
        <DashboardRecruitersChart
          period={dashboard.periods.recruiters}
          onPeriodChange={(value) =>
            dashboard.changePeriod('recruiters', value)
          }
          recruiters={dashboard.recruiters.data}
          isPending={dashboard.recruiters.loading}
          isError={dashboard.recruiters.error}
          onRetry={() => void dashboard.recruiters.retry()}
        />
      </div>
    </div>
  );
}
