import { useLocale, useTranslations } from 'next-intl';
import { previousDashboardPeriod } from '../utils/dashboard-format';

type DashboardMetricChangeProps = { change: number | null; period: string };

export default function DashboardMetricChange({
  change,
  period,
}: DashboardMetricChangeProps) {
  const locale = useLocale();
  const t = useTranslations('companyPage.dashboard.design');
  if (change === null) return null;
  return (
    <div className="flex min-h-8.5 flex-wrap items-center gap-2">
      <span className="text-dashboard-delta bg-dashboard-delta-bg rounded-full px-2 py-1 text-sm leading-4.5 font-semibold">
        <bdi>
          {new Intl.NumberFormat(locale, {
            style: 'percent',
            signDisplay: 'exceptZero',
            maximumFractionDigits: 1,
          }).format(change / 100)}
        </bdi>
      </span>
      <span className="text-dashboard-heading text-sm leading-4.5">
        {t('versus-period', {
          period: previousDashboardPeriod(period, locale),
        })}
      </span>
    </div>
  );
}
