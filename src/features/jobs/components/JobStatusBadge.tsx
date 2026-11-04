import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type { JobStatus } from '../types/index.types';
import { formatJobDateTime } from '../utils';

const STATUS_STYLES: Record<JobStatus, string> = {
  open: 'bg-primary-bg text-primary',
  closed: 'bg-secondary/8 text-secondary',
  paused: 'bg-destructive/8 text-destructive',
  draft: 'bg-foreground/18 text-muted-foreground',
};

type JobStatusBadgeProps = {
  status: JobStatus;
  // Last status change; hidden for open jobs (as in Figma).
  date?: string | null;
  className?: string;
};

export default function JobStatusBadge({ status, date, className }: JobStatusBadgeProps) {
  const t = useTranslations('companyPage.jobs.status');
  const locale = useLocale();
  const formattedDate = status === 'open' ? '' : formatJobDateTime(date, locale);

  return (
    <div
      className={cn(
        'flex h-6 w-full items-center gap-1 rounded-xl px-2 text-sm',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-current" />
      <span>{t(status)}</span>
      {formattedDate ? (
        <time className="text-muted-foreground ms-auto text-[10px]">{formattedDate}</time>
      ) : null}
    </div>
  );
}
