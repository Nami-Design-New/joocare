import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import type { CompanyJob } from '../index.type';
import { cn } from '@/shared/lib/utils';
import {
  formatDashboardDate,
  formatDashboardNumber,
} from '../utils/dashboard-format';
import DashboardIcon from './DashboardIcon';

type ActiveJobRowProps = { job: CompanyJob; centerActions?: boolean };

export default function ActiveJobRow({
  job,
  centerActions = false,
}: ActiveJobRowProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  return (
    <TableRow className="border-border bg-dashboard-primary/2 h-15.75 border-b">
      <TableCell className="px-4 py-[15.5px] text-start">
        <bdi>{job.job_title?.title ?? job.title}</bdi>
      </TableCell>
      <TableCell className="px-4 py-[15.5px] text-center">
        {formatDashboardNumber(job.views_num, locale)}
      </TableCell>
      <TableCell className="px-4 py-[15.5px] text-center">
        {formatDashboardNumber(job.applications_count, locale)}
      </TableCell>
      <TableCell className="text-muted-foreground px-4 py-[15.5px] text-center font-semibold">
        {formatDashboardDate(job.created_at, locale)}
      </TableCell>
      <TableCell
        className={cn(
          'px-4 py-[15.5px] text-end',
          centerActions && 'text-center',
        )}
      >
        <Button
          asChild
          size="sm"
          className="bg-dashboard-primary h-7.75 gap-1 rounded-full px-3 text-xs"
        >
          <Link href={'/company/job/candidates/' + job.id}>
            <DashboardIcon name="eye" width={14} />
            {t('view')}
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
