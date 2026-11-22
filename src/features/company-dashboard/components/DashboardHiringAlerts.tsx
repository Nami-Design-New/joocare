import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import EmptyDataState from '@/shared/components/EmptyDataState';
import type { DashboardStaleJobs } from '../index.type';
import DashboardIcon from './DashboardIcon';
import DashboardWidgetTitle from './DashboardWidgetTitle';

type DashboardHiringAlertsProps = {
  staleJobs?: DashboardStaleJobs;
  isPending: boolean;
};

export default function DashboardHiringAlerts({
  staleJobs,
  isPending,
}: DashboardHiringAlertsProps) {
  const t = useTranslations('companyPage.dashboard.design');
  const jobs = staleJobs?.jobs ?? [];
  const total = staleJobs?.total ?? 0;
  return (
    <section className="flex min-h-98 flex-col gap-5 rounded-xl border border-border/60 bg-card px-2 py-7 md:px-7 xl:col-span-2">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <DashboardIcon name="alert" width={22} height={19} />
          <DashboardWidgetTitle
            title={t('alerts-title')}
            description={t('alerts-description', { count: total })}
            className="text-xl leading-6"
          />
          {!isPending && (
            <span className="rounded-full bg-muted px-2.5 py-0.75 text-xs leading-4 font-semibold text-secondary">
              {t('jobs-count', { count: total })}
            </span>
          )}
        </div>
        {!isPending && total > 0 && (
          <p className="mt-2.5 text-sm leading-4.5 text-dashboard-heading">
            {t('alerts-description', { count: total })}
          </p>
        )}
      </div>
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-15 w-full rounded-xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyDataState
          titleText={t('no-alerts')}
          description={t('no-alerts-description')}
          className="min-h-64 [&_img]:max-w-24"
        />
      ) : (
        <>
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex min-h-15 items-center gap-3 rounded-xl border-s-4 border-b border-border py-3 ps-4 pe-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={'/company/job/candidates/' + job.id}
                    className="block truncate text-sm leading-4.5 font-semibold text-dashboard-primary underline underline-offset-2"
                  >
                    <bdi>{job.title}</bdi>
                  </Link>
                  <p className="truncate text-xs leading-4 text-dashboard-heading">
                    {job.specialty && (
                      <>
                        <bdi>{job.specialty}</bdi> ·{' '}
                      </>
                    )}
                    {t('published', { date: job.opened_at })}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-dashboard-danger-bg px-2 py-1 text-xs leading-3.75 font-semibold text-dashboard-danger">
                  {t('open-days', { days: job.days_open })}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between gap-3">
            <p className="text-sm leading-4.5 text-dashboard-heading">
              {t('showing-jobs', { count: jobs.length, total })}
            </p>
            {staleJobs?.has_more && (
              <Button
                asChild
                variant="outline"
                className="h-9 gap-1.5 rounded-full border-dashboard-primary px-4 text-sm font-semibold text-dashboard-primary"
              >
                <Link href="/company/dashboard/active-jobs">
                  {t('show-more')}
                  <DashboardIcon
                    name="arrow"
                    width={18}
                    className="rtl:rotate-180"
                  />
                </Link>
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
