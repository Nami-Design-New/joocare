import { useLocale, useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { DashboardPeriodOption } from '../index.type';
import DashboardIcon from './DashboardIcon';

type DashboardPeriodSelectProps = {
  value: string;
  options: DashboardPeriodOption[];
  label: string;
  onChange: (value: string) => void;
};

export default function DashboardPeriodSelect({
  value,
  options,
  label,
  onChange,
}: DashboardPeriodSelectProps) {
  const t = useTranslations('companyPage.dashboard.design');
  const locale = useLocale();
  return (
    <Select
      value={value}
      onValueChange={onChange}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <SelectTrigger
        aria-label={t('period-for', { widget: label })}
        className="h-7.5 w-30.75 gap-1 rounded-full border-border bg-card px-3 py-1.5 text-xs leading-4 shadow-none [&>svg]:hidden"
      >
        <DashboardIcon name="calendar" width={16} />
        <SelectValue />
        <DashboardIcon name="chevron-down" width={16} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
