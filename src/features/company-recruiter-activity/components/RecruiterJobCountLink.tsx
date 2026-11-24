import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import type { RecruiterJobStatus } from '../types/recruiter-activity.types';

const STATUS_STYLES: Record<RecruiterJobStatus, string> = {
  open: 'bg-primary-bg text-primary',
  closed: 'bg-foreground/8 text-muted-foreground',
  draft: 'bg-warning/10 text-warning',
};

type RecruiterJobCountLinkProps = {
  recruiterId: number;
  recruiterName: string;
  status: RecruiterJobStatus;
  count: number;
};

export default function RecruiterJobCountLink({
  recruiterId,
  recruiterName,
  status,
  count,
}: RecruiterJobCountLinkProps) {
  const t = useTranslations('companyPage.recruiter-activity');

  return (
    <Link
      href={{
        pathname: '/company/job-management',
        query: { status, recruiter: recruiterId },
      }}
      aria-label={t(`${status}-jobs-of`, { count, name: recruiterName })}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 underline underline-offset-2 transition-opacity hover:opacity-80',
        STATUS_STYLES[status],
      )}
    >
      <span className="text-sm font-semibold">{count}</span>
      <span>{t(status)}</span>
    </Link>
  );
}
