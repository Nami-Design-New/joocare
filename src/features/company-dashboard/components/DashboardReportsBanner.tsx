import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import DashboardIcon from './DashboardIcon';

export default function DashboardReportsBanner() {
  const t = useTranslations('companyPage.dashboard.design');
  return (
    <section className="bg-card flex min-h-22 flex-wrap items-center gap-4 rounded-2xl px-6 py-5 lg:flex-nowrap">
      <span className="bg-dashboard-primary/8 flex size-12 shrink-0 items-center justify-center rounded-xl">
        <DashboardIcon name="report" width={24} />
      </span>
      <div className="min-w-0 flex-1 basis-56">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-secondary text-base leading-5 font-semibold">
            {t('reports-title')}
          </h2>
          <span className="bg-warning-bg text-dashboard-coming border-warning/50 rounded-full border px-2.5 py-0.5 text-xs leading-4">
            {t('coming-soon')}
          </span>
        </div>
        <p className="text-muted-foreground mt-1.5 text-sm leading-4.5">
          {t('reports-description')}
        </p>
      </div>
      <Button
        type="button"
        disabled
        className="bg-muted text-muted-foreground h-9.5 gap-2 rounded-full px-4.5 text-sm disabled:opacity-50"
      >
        <DashboardIcon name="download" width={16} />
        {t('export-report')}
      </Button>
    </section>
  );
}
