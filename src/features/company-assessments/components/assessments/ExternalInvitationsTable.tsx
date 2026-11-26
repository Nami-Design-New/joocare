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
import { getCompanyChatHref } from '@/features/chat/utils/company-chat-href';
import { getCandidateProfileHref } from '@/features/company-projects/utils/candidate-profile-href';
import { cn } from '@/shared/lib/utils';
import {
  ASSESSMENT_ASSETS,
  EXTERNAL_INVITATIONS_PAGE_SIZE,
} from '../../constants/assessment-invitations';
import type { ExternalInvitation } from '../../types/assessment-invitation.types';
import { getCandidateImageSrc } from '../../utils/assessment-results';

type ExternalInvitationsTableProps = {
  rows: ExternalInvitation[];
  page: number;
  pageSize?: number;
  onInspect: (candidate: ExternalInvitation) => void;
  /** Opens the candidate CV; falls back to `onInspect` for preview rows. */
  onViewCv?: (candidate: ExternalInvitation) => void;
  /** Returns null when the candidate has no result to open yet. */
  getScoreHref: (candidate: ExternalInvitation) => string | null;
  onLinkJob?: (candidate: ExternalInvitation) => void;
  onLinkProject?: (candidate: ExternalInvitation) => void;
  tableLabel?: string;
};

export default function ExternalInvitationsTable({
  rows,
  page,
  pageSize = EXTERNAL_INVITATIONS_PAGE_SIZE,
  onInspect,
  onViewCv = onInspect,
  getScoreHref,
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
      renderCell: (_, index) =>
        format.number((page - 1) * pageSize + index + 1),
    },
    {
      id: 'name',
      header: t('name'),
      headerClassName: 'w-[21%]',
      renderCell: (candidate) => {
        const className = 'flex w-full items-center gap-2.5 text-start';
        const identity = (
          <>
            <Image
              src={getCandidateImageSrc(candidate.image)}
              width={32}
              height={32}
              alt=""
              className="size-8 shrink-0 rounded-full object-cover"
            />
            <span
              className={cn(
                'truncate text-sm font-semibold',
                candidate.status === 'invitation_pending'
                  ? 'text-foreground'
                  : 'text-assessment-primary underline underline-offset-2',
              )}
            >
              {candidate.name}
            </span>
          </>
        );
        if (candidate.status === 'invitation_pending')
          return <div className={className}>{identity}</div>;
        return candidate.userId ? (
          <Link
            href={getCandidateProfileHref(candidate.userId)}
            className={className}
          >
            {identity}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onInspect(candidate)}
            className={className}
          >
            {identity}
          </button>
        );
      },
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
              candidate.status === 'pending' ||
              candidate.status === 'invitation_pending',
            'bg-assessment-close text-assessment-absent':
              candidate.status === 'absent',
          })}
        >
          {t(
            candidate.status === 'invitation_pending'
              ? 'invitation-pending'
              : candidate.status,
          )}
        </span>
      ),
    },
    {
      id: 'date',
      header: t('date-time'),
      headerClassName: 'w-[12%]',
      renderCell: ({ date }) =>
        date === null ? (
          '—'
        ) : (
          <span className="block text-sm leading-[18px]">
            <span className="block">
              {(['day', 'month', 'year'] as const)
                .map((part) =>
                  format.dateTime(new Date(date), {
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
              {format.dateTime(new Date(date), {
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
      renderCell: (candidate) => {
        if (candidate.status === 'invitation_pending') return null;
        const href = getScoreHref(candidate);
        const score =
          candidate.score === null
            ? null
            : `${format.number(candidate.score)}%`;
        if (!href) return score ?? '—';
        return (
          <Button
            asChild
            className="h-8 gap-2 rounded-full bg-assessment-main py-1 ps-3 pe-1 text-sm"
          >
            <Link
              href={href}
              aria-label={t('view-score', { name: candidate.name })}
            >
              <span>{score ?? '—'}</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-card">
                <Image
                  src={`${ASSESSMENT_ASSETS}/score-eye.svg`}
                  width={16}
                  height={16}
                  alt=""
                />
              </span>
            </Link>
          </Button>
        );
      },
    },
    {
      id: 'cv',
      header: t('cv'),
      headerClassName: 'w-[6%]',
      renderCell: (candidate) =>
        candidate.status === 'invitation_pending' ? null : (
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('view-cv', { name: candidate.name })}
            onClick={() => onViewCv(candidate)}
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
              <span className="absolute inset-x-[6.25%] top-1/2 bottom-[9.38%] flex items-center justify-center rounded-[1.1px] bg-assessment-error">
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
      renderCell: (candidate) => {
        if (candidate.status === 'invitation_pending') return null;
        const icon = (
          <Image
            src={`${ASSESSMENT_ASSETS}/chat.svg`}
            width={20.0009}
            height={20.02}
            alt=""
          />
        );
        // Invitees without an account have no user id, so there is no one to chat with.
        if (!candidate.userId) {
          return (
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="size-8 rounded-full bg-assessment-primary/8"
              aria-label={t('chat-with', { name: candidate.name })}
            >
              {icon}
            </Button>
          );
        }
        return (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 rounded-full bg-assessment-primary/8"
          >
            <Link
              href={getCompanyChatHref({
                userId: candidate.userId,
                name: candidate.name,
                image: getCandidateImageSrc(candidate.image),
              })}
              aria-label={t('chat-with', { name: candidate.name })}
            >
              {icon}
            </Link>
          </Button>
        );
      },
    },
    {
      id: 'actions',
      header: t('actions'),
      headerClassName: 'w-[7%]',
      renderCell: (candidate) =>
        candidate.status === 'invitation_pending' ? null : (
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
          'px-2 py-5 text-[13px] leading-[normal] font-semibold text-assessment-dark first:rounded-s-lg last:rounded-e-lg',
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
