'use client';

import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { ASSESSMENT_ASSETS } from '../../constants/assessment-invitations';
import type { ExternalInvitation } from '../../types/assessment-invitation.types';

type ExternalInvitationsTableProps = {
  rows: ExternalInvitation[];
  page: number;
  onInspect: (candidate: ExternalInvitation) => void;
  onLinkJob?: (candidate: ExternalInvitation) => void;
  onLinkProject?: (candidate: ExternalInvitation) => void;
  tableLabel?: string;
};

export default function ExternalInvitationsTable({
  rows,
  page,
  onInspect,
  onLinkJob,
  onLinkProject,
  tableLabel,
}: ExternalInvitationsTableProps) {
  const t = useTranslations('companyPage.assessments.invitations');
  const format = useFormatter();
  const columns: DataTableColumn<ExternalInvitation>[] = [
    {
      id: 'number',
      header: '#',
      headerClassName: 'w-[4%]',
      renderCell: (_, index) => format.number((page - 1) * 10 + index + 1),
    },
    {
      id: 'name',
      header: t('name'),
      headerClassName: 'w-[21%]',
      renderCell: (candidate) => (
        <button
          type="button"
          onClick={() => onInspect(candidate)}
          className="flex w-full items-center gap-2.5 text-start"
        >
          <Image
            src={`${ASSESSMENT_ASSETS}/${candidate.image}`}
            width={32}
            height={32}
            alt=""
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <span className="text-assessment-primary truncate text-sm font-semibold underline underline-offset-2">
            {candidate.name}
          </span>
        </button>
      ),
    },
    {
      id: 'email',
      header: t('email'),
      headerClassName: 'w-[20%]',
      renderCell: (candidate) => (
        <span className="block truncate text-sm">{candidate.email}</span>
      ),
    },
    {
      id: 'status',
      header: t('status'),
      headerClassName: 'w-[11%]',
      renderCell: (candidate) => (
        <span
          className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', {
            'bg-assessment-primary/8 text-assessment-primary':
              candidate.status === 'passed',
            'bg-assessment-error/8 text-assessment-error':
              candidate.status === 'failed',
            'bg-assessment-warning/10 text-assessment-warning':
              candidate.status === 'pending',
            'bg-assessment-close text-assessment-absent':
              candidate.status === 'absent',
          })}
        >
          {t(candidate.status)}
        </span>
      ),
    },
    {
      id: 'date',
      header: t('date-time'),
      headerClassName: 'w-[12%]',
      renderCell: (candidate) => (
        <span className="block text-sm leading-[18px]">
          <span className="block">
            {(['day', 'month', 'year'] as const)
              .map((part) =>
                format.dateTime(new Date(candidate.date), {
                  [part]:
                    part === 'month'
                      ? 'short'
                      : part === 'day'
                        ? '2-digit'
                        : 'numeric',
                  timeZone: 'UTC',
                }),
              )
              .join(' ')}
          </span>
          <span className="block">
            {format.dateTime(new Date(candidate.date), {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'UTC',
            })}
          </span>
        </span>
      ),
    },
    {
      id: 'score',
      header: t('score'),
      headerClassName: 'w-[10%]',
      renderCell: (candidate) =>
        candidate.score === null ? (
          '—'
        ) : (
          <Button
            onClick={() => onInspect(candidate)}
            aria-label={t('view-score', { name: candidate.name })}
            className="bg-assessment-main h-8 gap-2 rounded-full py-1 ps-3 pe-1 text-sm"
          >
            <span>{format.number(candidate.score)}%</span>
            <span className="bg-card flex size-6 items-center justify-center rounded-full">
              <Image
                src={`${ASSESSMENT_ASSETS}/score-eye.svg`}
                width={16}
                height={16}
                alt=""
              />
            </span>
          </Button>
        ),
    },
    {
      id: 'cv',
      header: t('cv'),
      headerClassName: 'w-[6%]',
      renderCell: (candidate) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('view-cv', { name: candidate.name })}
          onClick={() => onInspect(candidate)}
        >
          <span className="relative size-6">
            <Image
              src={`${ASSESSMENT_ASSETS}/cv-file.svg`}
              width={24}
              height={24}
              alt=""
            />
            <Image
              src={`${ASSESSMENT_ASSETS}/cv-corner.svg`}
              width={9}
              height={9}
              alt=""
              className="absolute end-0 top-0"
            />
            <span className="bg-assessment-error absolute inset-x-[6.25%] top-1/2 bottom-[9.38%] flex items-center justify-center rounded-[1.1px]">
              <Image
                src={`${ASSESSMENT_ASSETS}/cv-label.svg`}
                width={14.5101}
                height={6.20833}
                alt=""
              />
            </span>
          </span>
        </Button>
      ),
    },
    {
      id: 'chat',
      header: t('chat'),
      headerClassName: 'w-[6%]',
      renderCell: (candidate) => (
        <Button
          onClick={() => onInspect(candidate)}
          variant="ghost"
          size="icon"
          aria-label={t('chat-with', { name: candidate.name })}
          className="bg-assessment-primary/8 size-8 rounded-full"
        >
          <Image
            src={`${ASSESSMENT_ASSETS}/chat.svg`}
            width={20.0009}
            height={20.02}
            alt=""
          />
        </Button>
      ),
    },
    {
      id: 'actions',
      header: t('actions'),
      headerClassName: 'w-[7%]',
      renderCell: (candidate) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('candidate-actions', { name: candidate.name })}
            >
              <Image
                src={`${ASSESSMENT_ASSETS}/actions.svg`}
                width={24}
                height={24}
                alt=""
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onLinkJob ? (
              <DropdownMenuItem onSelect={() => onLinkJob(candidate)}>
                {t('link-job')}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/company/job-management">{t('link-job')}</Link>
              </DropdownMenuItem>
            )}
            {onLinkProject ? (
              <DropdownMenuItem onSelect={() => onLinkProject(candidate)}>
                {t('link-project')}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/company/projects">{t('link-project')}</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <DataTable
      columns={columns.map((column) => ({
        ...column,
        headerClassName: cn(
          'px-2 py-5 text-[13px] leading-[normal] text-assessment-dark font-semibold first:rounded-s-lg last:rounded-e-lg',
          column.headerClassName,
        ),
        cellClassName: 'px-2 py-3 text-sm text-muted-foreground',
      }))}
      data={rows}
      getRowKey={(candidate) => candidate.id}
      ariaLabel={tableLabel ?? t('title')}
      className="min-w-[1004px] table-fixed"
      headerRowClassName="bg-muted border-b border-border hover:bg-muted"
      rowClassName="h-15 border-b border-border hover:bg-muted/20"
    />
  );
}
