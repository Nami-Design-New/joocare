import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import DashboardIcon from './DashboardIcon';

export default function DashboardReportsBanner() {
  const t = useTranslations('companyPage.dashboard.design');
  return (
    <section className="flex min-h-22 flex-wrap items-center gap-4 rounded-2xl bg-card px-6 py-5 lg:flex-nowrap">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-dashboard-primary/8">
        <DashboardIcon name="report" width={24} />
      </span>
      <div className="min-w-0 flex-1 basis-56">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base leading-5 font-semibold text-secondary">
            {t('reports-title')}
          </h2>
          <span className="rounded-full border border-warning/50 bg-warning-bg px-2.5 py-0.5 text-xs leading-4 text-dashboard-coming">
            {t('coming-soon')}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-4.5 text-muted-foreground">
          {t('reports-description')}
        </p>
      </div>
      <Button
        type="button"
        disabled
        className="h-9.5 gap-2 rounded-full bg-muted px-4.5 text-sm text-muted-foreground disabled:opacity-50"
      >
        <DashboardIcon name="download" width={16} />
        {t('export-report')}
      </Button>
    </section>
  );
}
