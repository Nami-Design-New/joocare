import { useTranslations } from 'next-intl';
import MonthPicker from '@/shared/components/MonthPicker';
import { currentDashboardMonth } from '../utils/dashboard-format';
import DashboardIcon from './DashboardIcon';

type DashboardPeriodSelectProps = {
  value: string;
  label: string;
  onChange: (value: string) => void;
};

export default function DashboardPeriodSelect({
  value,
  label,
  onChange,
}: DashboardPeriodSelectProps) {
  const t = useTranslations('companyPage.dashboard.design');
  return (
    <MonthPicker
      value={value}
      onChange={onChange}
      maxMonth={currentDashboardMonth()}
      ariaLabel={t('period-for', { widget: label })}
      startIcon={<DashboardIcon name="calendar" width={16} />}
      endIcon={<DashboardIcon name="chevron-down" width={16} />}
      className="h-7.5 w-30.75 rounded-full border-border bg-card px-3 py-1.5 text-xs leading-4 shadow-none"
    />
  );
}
