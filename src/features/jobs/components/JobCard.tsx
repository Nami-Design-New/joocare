'use client';

import Image from 'next/image';
import {
  ArrowRight,
  Briefcase,
  CheckCheck,
  CircleDollarSign,
  CircleEllipsis,
  Edit,
  Edit2,
  EyeOff,
  MapPin,
  Play,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { htmlToText } from '@/shared/lib/truncateHtml';
import { cn } from '@/shared/lib/utils';
import type {
  JobStatusAction,
  JobStatusTarget,
} from '../hooks/useJobStatusActions';
import type { JobStatus } from '../types/index.types';
import { JobListItem } from '../types/jobs.types';
import {
  formatJobDateTime,
  getCompletePostHref,
  getEditJobHref,
  getJobLocation,
  getJobSalaryWithCurrency,
  normalizeJobStatus,
} from '../utils';
import JobStatusBadge from './JobStatusBadge';

type JobCardProps = {
  job: Omit<JobListItem, 'status'> & {
    status?: {
      status: string;
      created_at: string;
    } | null;
    applications_count?: number;
  };
  isPinned?: boolean;
  onTogglePin?: () => void;
  onAction: (action: JobStatusAction, job: JobStatusTarget) => void;
};

// Figma card buttons: two equal pills, 34px high, 14px regular.
const BUTTON_CLASS =
  'h-9 w-full gap-1 rounded-full px-3 text-sm font-normal sm:h-8.5 sm:w-auto sm:flex-1';

export default function JobCard({
  job,
  isPinned = false,
  onTogglePin,
  onAction,
}: JobCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const title =
    job?.job_title?.title ||
    job?.title ||
    t('companyPage.postJob.review.untitledJob');
  const company = job?.company?.name || t('jobsPage.joocare-employer');
  const location = getJobLocation(job, t('jobsPage.location-not-specified'));
  const category =
    job?.category?.title || job?.category_title || t('jobsPage.not-specified');
  const salary = job.has_salary
    ? getJobSalaryWithCurrency(job, t('jobsPage.not-specified'))
    : t('jobsPage.not-specified');
  const tags = [
    job?.experience?.title ||
      job?.experience_title ||
      t('jobsPage.experience-not-specified'),
    job?.employment_type?.title || t('jobsPage.not-specified'),
    job?.specialty?.title || job?.specialty_title || t('jobsPage.healthcare'),
  ];
  const excerpt =
    htmlToText(job.description || '') ||
    t('jobsPage.card-description-fallback');
  const status = normalizeJobStatus(job.status?.status ?? 'draft');
  const isDraft = status === 'draft';
  const statusDate = job.status?.created_at ?? job.updated_at;
  const target: JobStatusTarget = { id: job.id, status };
  const menuItems = getJobMenuItems(job.id, status);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary">
      <header className="flex items-start gap-3.5">
        <div className="flex h-11.5 w-13 shrink-0 items-center justify-center rounded-xl bg-primary-bg">
          <Image
            width={44}
            height={40}
            src={job?.company?.image || '/assets/new-logo-dot.svg'}
            alt={t('companyPage.postJob.review.companyLogoAlt')}
            className="h-10 w-11 object-contain"
          />
        </div>
        <div className="flex min-w-0 grow flex-col gap-1">
          <h3 className="truncate text-lg font-semibold text-secondary">
            {title}
          </h3>
          <p className="text-sm text-foreground">{company}</p>
          {!isDraft ? (
            <time className="text-xs text-muted-foreground">
              {formatJobDateTime(statusDate, locale)}
            </time>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onTogglePin ? (
            <button
              type="button"
              onClick={onTogglePin}
              aria-pressed={isPinned}
              aria-label={t(
                isPinned
                  ? 'companyPage.jobs.listing.unpin-job'
                  : 'companyPage.jobs.listing.pin-job',
              )}
              className="group/pin flex size-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-5 transition-colors [mask:url(/assets/icons/pin-icon.svg)_center/contain_no-repeat]',
                  isPinned
                    ? 'bg-primary'
                    : 'bg-muted-foreground group-hover/pin:bg-foreground',
                )}
              />
            </button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t('companyPage.jobs.card.actions-menu', { title })}
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <CircleEllipsis
                  aria-hidden="true"
                  className="size-6"
                  strokeWidth={1.5}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40 rounded-xl">
              {menuItems.map(
                ({ key, icon: Icon, href, action, destructive }) => {
                  const label = t(`companyPage.jobs.actions.${key}`);
                  const itemClass = cn(
                    'gap-2 text-sm font-semibold text-muted-foreground md:text-base [&_svg]:size-5',
                    destructive && 'text-destructive focus:text-destructive',
                  );
                  return href ? (
                    <DropdownMenuItem key={key} asChild className={itemClass}>
                      <Link href={href}>
                        <Icon aria-hidden="true" /> {label}
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      key={key}
                      className={itemClass}
                      onSelect={() => action && onAction(action, target)}
                    >
                      <Icon
                        aria-hidden="true"
                        className={destructive ? 'text-destructive' : undefined}
                      />
                      {label}
                    </DropdownMenuItem>
                  );
                },
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-secondary md:text-sm">
        <li className="flex items-center gap-1">
          <MapPin
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          {location}
        </li>
        <li className="flex items-center gap-1">
          <Briefcase
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          {category}
        </li>
        <li className="flex items-center gap-1">
          <CircleDollarSign
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          {salary}
        </li>
      </ul>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <li
            key={`${tag}-${index}`}
            className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground md:text-sm"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
        {excerpt}
      </p>

      <footer className="mt-auto flex flex-col gap-4 border-t border-border pt-4">
        {!isDraft ? (
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button asChild variant="secondary" className={BUTTON_CLASS}>
              <Link href={`/company/job/candidates/${job.id}`}>
                {t('companyPage.jobs.card.received-applications')}
                {job.applications_count !== undefined ? (
                  <strong className="ms-1 font-semibold">
                    {job.applications_count}
                  </strong>
                ) : null}
              </Link>
            </Button>
            <Button asChild className={BUTTON_CLASS}>
              <Link href={`/company/job/${job.id}`}>
                {t('companyPage.jobs.card.job-details')}
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 rtl:rotate-180"
                  strokeWidth={1.5}
                />
              </Link>
            </Button>
          </div>
        ) : null}
        <JobStatusBadge status={status} date={statusDate} />
      </footer>
    </article>
  );
}

type JobMenuItem = {
  // Translation key under companyPage.jobs.actions
  key: 'edit' | 'close' | 'pause' | 'reactivate' | 'complete-post' | 'delete';
  icon: LucideIcon;
  href?: string;
  action?: JobStatusAction;
  destructive?: boolean;
};

// ⋯ menu per status (Figma job listing; closed/draft menus per product defaults).
function getJobMenuItems(
  jobId: number | string,
  status: JobStatus,
): JobMenuItem[] {
  const edit: JobMenuItem = {
    key: 'edit',
    icon: Edit,
    href: getEditJobHref(jobId),
  };
  const close: JobMenuItem = {
    key: 'close',
    icon: CheckCheck,
    action: 'close',
  };
  const remove: JobMenuItem = {
    key: 'delete',
    icon: Trash2,
    action: 'delete',
    destructive: true,
  };
  const reactivate: JobMenuItem = {
    key: 'reactivate',
    icon: Play,
    action: 'resume',
  };

  switch (status) {
    case 'open':
      return [
        edit,
        close,
        { key: 'pause', icon: EyeOff, action: 'pause' },
        remove,
      ];
    case 'paused':
      return [edit, close, reactivate, remove];
    case 'closed':
      return [reactivate, remove];
    case 'draft':
      return [
        { key: 'complete-post', icon: Edit2, href: getCompletePostHref(jobId) },
        remove,
      ];
  }
}
