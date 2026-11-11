'use client';

import { useLocale, useTranslations } from 'next-intl';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { useCompanyDashboard } from '../hooks/useCompanyDashboard';
import {
  DASHBOARD_DESIGN_PERIOD,
  dashboardDesignAnalytics,
} from '../constants/dashboard-preview';
import {
  formatDashboardNumber,
  dashboardNumber,
  previousDashboardPeriod,
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
  const number = (value: number | string | undefined, compact = false) =>
    dashboardNumber(value) === null
      ? t('no-data')
      : formatDashboardNumber(value, locale, compact);
  const periodSelect = (key: DashboardPeriodKey, title: string) => (
    <DashboardPeriodSelect
      value={dashboard.periods[key]}
      options={dashboard.periodOptions}
      label={title}
      onChange={(value) => dashboard.changePeriod(key, value)}
    />
  );

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
              data?.active_jobs === undefined
                ? t('no-data')
                : '+' + number(data.active_jobs)
            }
            description={t('active-jobs-description')}
            icon="active-jobs"
            isPending={dashboard.loading}
          />
          <DashBoardStatsCard
            title={t('applications-title')}
            value={number(data?.total_applications)}
            description={t('applications-description')}
            icon="applications"
            isPending={dashboard.loading}
            periodSelect={periodSelect('applications', t('applications-title'))}
            comparison={
              <>
                <strong>
                  {'+' +
                    number(dashboardDesignAnalytics.totalApplicationChange)}
                </strong>{' '}
                {t('versus-period', {
                  period: previousDashboardPeriod(
                    dashboard.periods.applications,
                    locale,
                    false,
                  ),
                })}
              </>
            }
          />
          <DashBoardStatsCard
            title={t('activity-title')}
            value={
              data?.applications_latest_activity === undefined
                ? t('no-data')
                : '+' + number(data.applications_latest_activity)
            }
            suffix={t('application-unit')}
            description={
              designPreview
                ? t('activity-hours', { hours: 2 })
                : t('activity-description')
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
              days: dashboardDesignAnalytics.timeToFill,
            })}
            suffix={t('average-time-close')}
            periodSelect={periodSelect('timeToFill', t('time-title'))}
            empty={dashboard.periods.timeToFill !== DASHBOARD_DESIGN_PERIOD}
          >
            <DashboardTimeToFill days={dashboardDesignAnalytics.timeToFill} />
          </DashboardAnalyticsCard>
          <DashboardAnalyticsCard
            title={t('reach-title')}
            description={t('reach-description')}
            icon="brand-reach"
            iconHeight={12}
            value={number(dashboardDesignAnalytics.brandReach, true)}
            suffix={t('unique-profile-viewers')}
            periodSelect={periodSelect('reach', t('reach-title'))}
            empty={dashboard.periods.reach !== DASHBOARD_DESIGN_PERIOD}
          >
            <DashboardMetricChange
              change={dashboardDesignAnalytics.brandReachChange}
              period={dashboard.periods.reach}
            />
          </DashboardAnalyticsCard>
          <DashboardAnalyticsCard
            title={t('intake-title')}
            description={t('intake-description')}
            icon="talent-intake"
            value={number(data?.cvs_downloaded)}
            suffix={t('cvs-downloaded')}
            periodSelect={periodSelect('intake', t('intake-title'))}
            isPending={dashboard.loading}
          >
            <DashboardMetricChange
              change={dashboardDesignAnalytics.talentIntakeChange}
              period={dashboard.periods.intake}
            />
          </DashboardAnalyticsCard>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <PieChartCard
            categories={data?.categories_percentage ?? []}
            isPending={dashboard.loading}
          />
          <DashboardHiringAlerts />
        </div>
        <ActiveJobsTable designPreview={designPreview} />
        <DashboardRecruitersChart
          period={dashboard.periods.recruiters}
          options={dashboard.periodOptions}
          onPeriodChange={(value) =>
            dashboard.changePeriod('recruiters', value)
          }
          empty={dashboard.periods.recruiters !== DASHBOARD_DESIGN_PERIOD}
        />
      </div>
    </div>
  );
}
