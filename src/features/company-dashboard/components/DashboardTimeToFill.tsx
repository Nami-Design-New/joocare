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
      <p className="text-xs leading-4 text-muted-foreground">
        {t('days-from-publish')}
      </p>
      <div
        role="meter"
        aria-label={t('time-title')}
        aria-valuemin={0}
        aria-valuemax={DASHBOARD_FILL_SCALE_MAX}
        aria-valuenow={days}
        aria-valuetext={t('time-days', { days })}
        className="relative h-2 rounded-full bg-dashboard-primary/12"
      >
        <span
          className="absolute inset-y-0 start-0 rounded-full bg-dashboard-primary"
          style={{
            width: Math.min(days / DASHBOARD_FILL_SCALE_MAX, 1) * 100 + '%',
          }}
        />
        <span
          className="absolute -top-1 h-4 w-0.5 bg-dashboard-heading"
          style={{
            insetInlineStart:
              (DASHBOARD_FILL_LIMIT / DASHBOARD_FILL_SCALE_MAX) * 100 + '%',
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs leading-4 text-muted-foreground">
        <span>{format.format(0)}</span>
        <span>{format.format(15)}</span>
        <span>{t('fill-limit')}</span>
        <span>{t('fill-scale-max')}</span>
      </div>
    </div>
  );
}
