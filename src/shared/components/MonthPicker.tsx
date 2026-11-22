'use client';

import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';

type MonthPickerProps = {
  /** Selected month as `YYYY-MM`. */
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  /** Earliest selectable month as `YYYY-MM`. */
  minMonth?: string;
  /** Latest selectable month as `YYYY-MM`. */
  maxMonth?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
};

function toMonthValue(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

function parseYear(value: string) {
  const year = Number(value.slice(0, 4));
  return Number.isInteger(year) ? year : new Date().getFullYear();
}

export default function MonthPicker({
  value,
  onChange,
  ariaLabel,
  minMonth,
  maxMonth,
  startIcon,
  endIcon,
  className,
  align = 'end',
}: MonthPickerProps) {
  const t = useTranslations('common.month-picker');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => parseYear(value));
  const monthName = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC',
  });
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const yearLabel = new Intl.NumberFormat(locale, { useGrouping: false });
  const isOutOfRange = (month: string) =>
    (minMonth !== undefined && month < minMonth) ||
    (maxMonth !== undefined && month > maxMonth);
  const selectedDate = new Date(value + '-01T00:00:00Z');

  function changeOpen(next: boolean) {
    if (next) setYear(parseYear(value));
    setOpen(next);
  }

  function selectMonth(month: string) {
    onChange(month);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          className={cn('gap-1 font-normal', className)}
        >
          {startIcon}
          <span>
            {Number.isNaN(selectedDate.getTime())
              ? value
              : monthLabel.format(selectedDate)}
          </span>
          {endIcon}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-64 p-3">
        <div className="mb-3 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={t('previous-year')}
            disabled={
              minMonth !== undefined && toMonthValue(year - 1, 11) < minMonth
            }
            onClick={() => setYear((current) => current - 1)}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </Button>
          <span aria-live="polite" className="text-sm font-semibold">
            {yearLabel.format(year)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={t('next-year')}
            disabled={
              maxMonth !== undefined && toMonthValue(year + 1, 0) > maxMonth
            }
            onClick={() => setYear((current) => current + 1)}
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 12 }, (_, monthIndex) => {
            const month = toMonthValue(year, monthIndex);
            const selected = month === value;
            return (
              <Button
                key={month}
                type="button"
                size="sm"
                variant={selected ? 'default' : 'ghost'}
                aria-pressed={selected}
                disabled={isOutOfRange(month)}
                onClick={() => selectMonth(month)}
                className="h-9 rounded-full text-xs font-normal"
              >
                {monthName.format(new Date(Date.UTC(year, monthIndex, 1)))}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
