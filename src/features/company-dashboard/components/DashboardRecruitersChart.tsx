import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { DASHBOARD_RECRUITER_TICK_COUNT } from '../constants/dashboard-config';
import type { DashboardAdminJobs, DashboardPage } from '../index.type';
import DashboardIcon from './DashboardIcon';
import DashboardPeriodSelect from './DashboardPeriodSelect';
import DashboardWidgetTitle from './DashboardWidgetTitle';

type DashboardRecruitersChartProps = {
  period: string;
  onPeriodChange: (value: string) => void;
  recruiters?: DashboardPage<DashboardAdminJobs>;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
};

export default function DashboardRecruitersChart({
  period,
  onPeriodChange,
  recruiters,
  isPending,
  isError,
  onRetry,
}: DashboardRecruitersChartProps) {
  const t = useTranslations('companyPage.dashboard.design');
  const locale = useLocale();
  const format = new Intl.NumberFormat(locale);
  const rows = recruiters?.data ?? [];
  const highest = Math.max(0, ...rows.map((row) => row.jobs_count));
  const step = Math.max(1, Math.ceil(highest / DASHBOARD_RECRUITER_TICK_COUNT));
  const scaleMax = step * DASHBOARD_RECRUITER_TICK_COUNT;
  const ticks = Array.from(
    { length: DASHBOARD_RECRUITER_TICK_COUNT + 1 },
    (_, index) => index * step,
  );
  const empty = highest === 0;

  return (
    <section className="space-y-6 rounded-2xl bg-card p-4 sm:p-6">
      <div className="flex min-h-11.5 flex-wrap items-center justify-between gap-3">
        <DashboardWidgetTitle
          title={t('recruiters-title')}
          description={t('recruiters-description')}
          className="text-[21px] leading-6.5"
        />
        <DashboardPeriodSelect
          value={period}
          label={t('recruiters-title')}
          onChange={onPeriodChange}
        />
      </div>
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4">
          <p className="text-destructive">{t('recruiters-error')}</p>
          <Button type="button" variant="outline" onClick={onRetry}>
            {t('retry')}
          </Button>
        </div>
      ) : empty ? (
        <EmptyDataState
          titleText={t('no-period-data')}
          description={t('choose-another-period')}
          className="min-h-82.75 [&_img]:max-w-28"
        />
      ) : (
        <div
          role="group"
          aria-label={t('recruiters-chart-description')}
          className="overflow-x-auto"
        >
          <div className="relative min-w-140 pb-10.75">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-54 end-18 bottom-10.75 flex justify-between"
            >
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className="relative h-full border-s border-border"
                >
                  <span className="absolute top-full mt-2 -translate-x-1/2 text-xs leading-4 text-muted-foreground rtl:translate-x-1/2">
                    {format.format(tick)}
                  </span>
                </span>
              ))}
            </div>
            <ol>
              {rows.map((recruiter, index) => (
                <li
                  key={recruiter.admin_id}
                  className="relative flex h-9 items-center text-sm leading-4.5"
                >
                  <span className="w-6 shrink-0 text-muted-foreground">
                    {format.format(index + 1)}
                  </span>
                  <Link
                    href="/company/recruiter-activity"
                    className="w-48 shrink-0 truncate pe-4 text-secondary hover:underline"
                  >
                    <bdi>{recruiter.admin_name}</bdi>
                  </Link>
                  <div className="flex min-w-0 flex-1 items-center pe-18">
                    <span
                      className="h-4 rounded-e-[3px] bg-dashboard-primary"
                      style={{
                        width: (recruiter.jobs_count / scaleMax) * 100 + '%',
                      }}
                    />
                    <span className="ms-2 shrink-0 text-sm font-semibold text-secondary">
                      {format.format(recruiter.jobs_count)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="absolute start-54 end-18 bottom-0 text-center text-xs leading-4 text-muted-foreground">
              {t('jobs-posted')}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-4.5 text-dashboard-heading">
          {t('showing-recruiters', {
            count: empty ? 0 : rows.length,
            total: empty ? 0 : (recruiters?.total ?? 0),
          })}
        </p>
        <Button
          asChild
          variant="outline"
          className="h-9 gap-1.5 rounded-full border-dashboard-primary px-4 text-sm font-semibold text-dashboard-primary"
        >
          <Link href="/company/recruiter-activity">
            {t('view-all-recruiters')}
            <DashboardIcon name="arrow" width={18} className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
