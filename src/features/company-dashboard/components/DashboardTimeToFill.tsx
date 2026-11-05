import { useLocale, useTranslations } from 'next-intl';
import {
  DASHBOARD_FILL_LIMIT,
  DASHBOARD_FILL_SCALE_MAX,
} from '../constants/dashboard-preview';

type DashboardTimeToFillProps = { days: number };

export default function DashboardTimeToFill({
  days,
}: DashboardTimeToFillProps) {
  const t = useTranslations('companyPage.dashboard.design');
  const locale = useLocale();
  const format = new Intl.NumberFormat(locale);
  return (
    <div className="relative h-14 pt-2.5">
      <p className="text-muted-foreground text-xs leading-4">
        {t('days-from-publish')}
      </p>
      <div
        role="meter"
        aria-label={t('time-title')}
        aria-valuemin={0}
        aria-valuemax={DASHBOARD_FILL_SCALE_MAX}
        aria-valuenow={days}
        aria-valuetext={t('time-days', { days })}
        className="bg-dashboard-primary/12 relative h-2 rounded-full"
      >
        <span
          className="bg-dashboard-primary absolute inset-y-0 start-0 rounded-full"
          style={{
            width: Math.min(days / DASHBOARD_FILL_SCALE_MAX, 1) * 100 + '%',
          }}
        />
        <span
          className="bg-dashboard-heading absolute -top-1 h-4 w-0.5"
          style={{
            insetInlineStart:
              (DASHBOARD_FILL_LIMIT / DASHBOARD_FILL_SCALE_MAX) * 100 + '%',
          }}
        />
      </div>
      <div className="text-muted-foreground mt-1 flex justify-between text-xs leading-4">
        <span>{format.format(0)}</span>
        <span>{format.format(15)}</span>
        <span>{t('fill-limit')}</span>
        <span>{t('fill-scale-max')}</span>
      </div>
    </div>
  );
}
