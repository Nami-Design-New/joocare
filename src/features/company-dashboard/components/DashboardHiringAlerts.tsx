import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { formatDashboardDate } from '../utils/dashboard-format';
import {
  dashboardDesignAnalytics,
  dashboardHiringAlerts,
} from '../constants/dashboard-preview';
import DashboardIcon from './DashboardIcon';
import DashboardWidgetTitle from './DashboardWidgetTitle';

export default function DashboardHiringAlerts() {
  const t = useTranslations('companyPage.dashboard.design');
  const locale = useLocale();
  const alerts = dashboardHiringAlerts;
  const total = dashboardDesignAnalytics.alertCount;
  return (
    <section className="bg-card border-border/60 flex min-h-98 flex-col gap-5 rounded-xl border px-2 md:px-7 py-7 xl:col-span-2">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <DashboardIcon name="alert" width={22} height={19} />
          <DashboardWidgetTitle
            title={t('alerts-title')}
            description={t('alerts-description', { count: total })}
            className="text-xl leading-6"
          />
          <span className="bg-muted text-secondary rounded-full px-2.5 py-0.75 text-xs leading-4 font-semibold">
            {t('jobs-count', { count: total })}
          </span>
        </div>
        <p className="text-dashboard-heading mt-2.5 text-sm leading-4.5">
          {t('alerts-description', { count: total })}
        </p>
      </div>
      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="border-border flex min-h-15 items-center gap-3 rounded-xl border-s-4 border-b py-3 ps-4 pe-4"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={alert.href}
                className="text-dashboard-primary block truncate text-sm leading-4.5 font-semibold underline underline-offset-2"
              >
                <bdi>{alert.title}</bdi>
              </Link>
              <p className="text-dashboard-heading truncate text-xs leading-4">
                <bdi>{alert.company}</bdi> ·{' '}
                {t('published', {
                  date: formatDashboardDate(alert.publishedAt, locale, true),
                })}
              </p>
            </div>
            <span className="bg-dashboard-danger-bg text-dashboard-danger shrink-0 rounded-full px-2 py-1 text-xs leading-3.75 font-semibold">
              {t('open-days', { days: alert.openDays })}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3">
        <p className="text-dashboard-heading text-sm leading-4.5">
          {t('showing-jobs', { count: alerts.length, total })}
        </p>
        <Button
          asChild
          variant="outline"
          className="border-dashboard-primary text-dashboard-primary h-9 gap-1.5 rounded-full px-4 text-sm font-semibold"
        >
          <Link href="/company/dashboard/active-jobs">
            {t('show-more')}
            <DashboardIcon name="arrow" width={18} className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
