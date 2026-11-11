'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useFormatter, useLocale, useNow, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { useJobCardDetails } from '../../hooks/useJobCardDetails';
import { useJobShare } from '../../hooks/useJobShare';
import type { ApplicationAssessment } from '../../types/candidate-applications.types';
import type { JobListItem } from '../../types/jobs.types';
import { formatApplicationDate } from '../../utils/application-format';
import ApplicationIcon, { type ApplicationIconName } from './ApplicationIcon';
import ApplicationStatus from './ApplicationStatus';
import JobMatchBadge from './JobMatchBadge';
import ToggleSavedJobButton from './ToggleSavedJobButton';

type ApplicationJobCardProps = {
  job: JobListItem;
  /** Set for the Applied tab: shows the applied strip instead of the match badge. */
  application?: { appliedAt: string; assessment?: ApplicationAssessment };
  onSavedChange?: (saved: boolean) => void;
};

// Job card of the candidate Job Applications page (Saved / Applied tabs).
export default function ApplicationJobCard({
  job,
  application,
  onSavedChange,
}: ApplicationJobCardProps) {
  const t = useTranslations('jobsPage');
  const locale = useLocale();
  const format = useFormatter();
  const now = useNow();
  const { data: session } = useSession();
  const details = useJobCardDetails(job);
  const href = `/jobs/${job.id}`;
  const { shareJob } = useJobShare({ title: details.title, path: href });
  const postedAt = details.postedAt || job.created_at;
  const meta: { icon: ApplicationIconName; value: string }[] = [
    { icon: 'location', value: details.location },
    { icon: 'category', value: details.category },
    { icon: 'salary', value: details.salary },
  ];
  const tags = [details.experience, details.employmentType, details.specialty];

  return (
    <Card className="group gap-4 rounded-2xl border-border p-4 shadow-none hover:border-primary">
      <div className="flex min-h-16 items-start gap-3.5">
        <Image
          width={52}
          height={46}
          src={details.companyLogo || '/assets/new-logo-dot.svg'}
          alt={details.company}
          className="h-11.5 w-13 shrink-0 rounded-xl bg-application-primary/8 object-contain"
        />
        <div className="flex min-w-0 grow flex-col gap-1">
          <h3 className="truncate text-lg leading-5.75 font-semibold text-secondary group-hover:text-primary">
            <Link href={href}>{details.title}</Link>
          </h3>
          <p className="truncate text-sm leading-4.5">{details.company}</p>
          {postedAt && (
            <time
              dateTime={postedAt}
              suppressHydrationWarning
              className={cn(
                'text-[11px] leading-3.5 text-muted-foreground',
                !application && 'text-warning',
              )}
            >
              {application
                ? formatApplicationDate(postedAt, locale)
                : format.relativeTime(new Date(postedAt), now)}
            </time>
          )}
        </div>
        {!application && (
          <JobMatchBadge
            score={job.match_score}
            icon={<ApplicationIcon name="sparkles" />}
            className="rounded-full bg-application-primary/8 text-application-primary"
          />
        )}
      </div>

      <ul className="flex flex-wrap items-start gap-2">
        {meta.map(({ icon, value }) => (
          <li
            key={icon}
            className="flex items-start gap-1 text-sm leading-4.5 text-secondary"
          >
            <ApplicationIcon name={icon} />
            {value}
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap items-center gap-1">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-muted px-2 py-1 text-xs leading-3.75 text-muted-foreground"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="line-clamp-2 min-h-9 max-w-63 text-sm leading-4.5 text-muted-foreground">
        {details.excerpt || t('card-description-fallback')}
      </p>

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <div className="flex gap-2">
            {session?.authRole !== 'employer' && (
              <ToggleSavedJobButton
                jobId={job.id}
                initialIsSaved={job.is_saved}
                onSavedChange={onSavedChange}
                appearance="applications"
              />
            )}
            <Button
              variant="outline"
              size="pill"
              onClick={() => void shareJob()}
              className="h-8.5 gap-1 border-border bg-muted px-3 text-sm font-normal text-muted-foreground"
            >
              <ApplicationIcon name="share" size={14} />
              {t('share')}
            </Button>
          </div>
          <Link
            href={href}
            className="flex h-8.5 items-center gap-2 rounded-full bg-application-primary px-3 py-2 text-sm text-white"
          >
            {t('view-job')}
            <ApplicationIcon
              name="arrow"
              size={20}
              className="rtl:rotate-180"
            />
          </Link>
        </div>
        {application && (
          <ApplicationStatus
            appliedAt={application.appliedAt}
            // assessment={application.assessment}
          />
        )}
      </div>
    </Card>
  );
}
