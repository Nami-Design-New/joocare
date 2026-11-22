import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { formatGrowthRate } from '../utils/dashboard-format';

type DashboardMetricChangeProps = {
  /** Percent change, e.g. -4.55. */
  change: number;
  previousPeriodLabel: string;
};

export default function DashboardMetricChange({
  change,
  previousPeriodLabel,
}: DashboardMetricChangeProps) {
  const locale = useLocale();
  const t = useTranslations('companyPage.dashboard.design');
  return (
    <div className="flex min-h-8.5 flex-wrap items-center gap-2">
      <span
        className={cn(
          'rounded-full px-2 py-1 text-sm leading-4.5 font-semibold',
          change < 0
            ? 'bg-dashboard-danger-bg text-dashboard-danger'
            : 'bg-dashboard-delta-bg text-dashboard-delta',
        )}
      >
        <bdi>{formatGrowthRate(change, locale)}</bdi>
      </span>
      <span className="text-sm leading-4.5 text-dashboard-heading">
        {t('versus-period', { period: previousPeriodLabel })}
      </span>
    </div>
  );
}
