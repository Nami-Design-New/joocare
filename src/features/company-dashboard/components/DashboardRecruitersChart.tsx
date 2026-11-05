import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import EmptyDataState from '@/shared/components/EmptyDataState';
import {
  dashboardDesignAnalytics,
  dashboardRecruiters,
} from '../constants/dashboard-preview';
import type { DashboardPeriodOption } from '../index.type';
import DashboardIcon from './DashboardIcon';
import DashboardPeriodSelect from './DashboardPeriodSelect';
import DashboardWidgetTitle from './DashboardWidgetTitle';

type DashboardRecruitersChartProps = {
  period: string;
  options: DashboardPeriodOption[];
  onPeriodChange: (value: string) => void;
  empty: boolean;
};

export default function DashboardRecruitersChart({
  period,
  options,
  onPeriodChange,
  empty,
}: DashboardRecruitersChartProps) {
  const t = useTranslations('companyPage.dashboard.design');
  const locale = useLocale();
  const format = new Intl.NumberFormat(locale);
  return (
    <section className="bg-card space-y-6 rounded-2xl p-6">
      <div className="flex min-h-11.5 flex-wrap items-center justify-between gap-3">
        <DashboardWidgetTitle
          title={t('recruiters-title')}
          description={t('recruiters-description')}
          className="text-[21px] leading-6.5"
        />
        <DashboardPeriodSelect
          value={period}
          options={options}
          label={t('recruiters-title')}
          onChange={onPeriodChange}
        />
      </div>
      {empty ? (
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
              {[0, 10, 20, 30, 40].map((tick) => (
                <span
                  key={tick}
                  className="border-border relative h-full border-s"
                >
                  <span className="text-muted-foreground absolute top-full mt-2 -translate-x-1/2 text-xs leading-4 rtl:translate-x-1/2">
                    {format.format(tick)}
                  </span>
                </span>
              ))}
            </div>
            <ol>
              {dashboardRecruiters.map((recruiter, index) => (
                <li
                  key={recruiter.id}
                  className="relative flex h-9 items-center text-sm leading-4.5"
                >
                  <span className="text-muted-foreground w-6 shrink-0">
                    {format.format(index + 1)}
                  </span>
                  <Link
                    href="/company/recruiter-activity"
                    className="text-secondary w-48 shrink-0 truncate pe-4 hover:underline"
                  >
                    <bdi>{recruiter.name}</bdi>
                  </Link>
                  <div className="flex min-w-0 flex-1 items-center pe-18">
                    <span
                      className="bg-dashboard-primary h-4 rounded-e-[3px]"
                      style={{ width: (recruiter.jobsPosted / 40) * 100 + '%' }}
                    />
                    <span className="text-secondary ms-2 shrink-0 text-sm font-semibold">
                      {format.format(recruiter.jobsPosted)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-muted-foreground absolute start-54 end-18 bottom-0 text-center text-xs leading-4">
              {t('jobs-posted')}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-dashboard-heading text-sm leading-4.5">
          {t('showing-recruiters', {
            count: empty ? 0 : dashboardRecruiters.length,
            total: empty ? 0 : dashboardDesignAnalytics.recruiterCount,
          })}
        </p>
        <Button
          asChild
          variant="outline"
          className="border-dashboard-primary text-dashboard-primary h-9 gap-1.5 rounded-full px-4 text-sm font-semibold"
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
