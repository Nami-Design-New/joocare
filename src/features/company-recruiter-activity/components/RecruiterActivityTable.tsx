'use client';

import { Folder } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { RECRUITER_JOB_STATUSES } from '../constants/recruiter-activity-preview-data';
import type { RecruiterActivity } from '../types/recruiter-activity.types';
import RecruiterJobCountLink from './RecruiterJobCountLink';

type RecruiterActivityTableProps = {
  recruiters: RecruiterActivity[];
  direction: 'ltr' | 'rtl';
};

const HEADER_CLASS = 'text-base';

export default function RecruiterActivityTable({
  recruiters,
  direction,
}: RecruiterActivityTableProps) {
  const t = useTranslations('companyPage.recruiter-activity');
  const columns: DataTableColumn<RecruiterActivity>[] = [
    {
      id: 'name',
      header: t('columns.name'),
      headerClassName: HEADER_CLASS,
      renderCell: (recruiter) => (
        <span className="inline-flex items-center gap-2">
          <span
            className={
              recruiter.isDeleted ? 'text-muted-foreground' : undefined
            }
          >
            {recruiter.name}
          </span>
          {recruiter.isDeleted && (
            <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
              {t('deleted')}
            </span>
          )}
        </span>
      ),
    },
    ...RECRUITER_JOB_STATUSES.map(
      (status): DataTableColumn<RecruiterActivity> => ({
        id: status,
        header: t(`columns.${status}`),
        headerClassName: HEADER_CLASS,
        renderCell: (recruiter) => (
          <RecruiterJobCountLink
            recruiter={recruiter.name}
            status={status}
            count={recruiter.jobs[status]}
          />
        ),
      }),
    ),
    {
      id: 'projects',
      header: t('columns.projects'),
      headerClassName: HEADER_CLASS,
      renderCell: (recruiter) => (
        <Link
          href={{
            pathname: '/company/projects',
            query: { recruiter: recruiter.name },
          }}
          className="inline-flex items-center gap-1.5 underline underline-offset-2 transition-colors hover:text-primary"
        >
          <Folder aria-hidden="true" className="size-4" strokeWidth={1.5} />
          <span>
            <span className="font-semibold">{recruiter.projects}</span>{' '}
            {t('projects')}
          </span>
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={recruiters}
      getRowKey={(recruiter) => recruiter.id}
      dir={direction}
      ariaLabel={t('table-label')}
      className="min-w-200"
      headerRowClassName="bg-muted hover:bg-muted"
      rowClassName="bg-body-bg"
    />
  );
}
