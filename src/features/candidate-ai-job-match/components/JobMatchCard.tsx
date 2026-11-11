import { Fragment } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { JOB_MATCH_META_ICONS } from '../constants/job-match-icons';
import { MATCH_LEVEL_STYLES } from '../constants/match-level-styles';
import type { JobMatch } from '../types/ai-job-match.types';
import { getMatchLevel } from '../utils/match-level';
import JobMatchChip from './JobMatchChip';
import MatchScoreBadge from './MatchScoreBadge';

type JobMatchCardProps = {
  job: JobMatch;
};

const ACTION_CLASS_NAME = 'h-8.5 rounded-full px-3 py-2 text-sm font-normal';

export default function JobMatchCard({ job }: JobMatchCardProps) {
  const t = useTranslations('candidatePage.aiJobMatch');
  const level = getMatchLevel(job.score);
  const href = `/jobs/${job.id}`;
  const meta = [
    { icon: JOB_MATCH_META_ICONS.location, value: job.location },
    { icon: JOB_MATCH_META_ICONS.salary, value: job.salary },
    { icon: JOB_MATCH_META_ICONS.jobType, value: job.employmentType },
  ];

  return (
    <Card className="gap-5 rounded-2xl border-border p-4 shadow-header">
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <Image
            src={job.companyLogo}
            width={52}
            height={46}
            alt=""
            className="h-11.5 w-13 shrink-0 rounded-[11.52px] bg-match-primary/8 object-contain p-1.5"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h3 className="truncate text-lg leading-[23px] font-semibold text-secondary">
                <Link href={href} className="hover:text-match-primary">
                  {job.title}
                </Link>
              </h3>
              <p className="truncate text-sm leading-[23px] text-muted-foreground">
                {job.companyName}
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-2 text-sm leading-[18px] text-foreground">
              {meta.map(({ icon, value }, index) => (
                <Fragment key={value}>
                  {index > 0 && (
                    <li
                      aria-hidden
                      className="size-0.5 rounded-full bg-border"
                    />
                  )}
                  <li className="flex items-center gap-1">
                    <Image
                      src={icon}
                      width={16}
                      height={16}
                      alt=""
                      className="size-4 shrink-0"
                    />
                    {value}
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
        <MatchScoreBadge score={job.score} />
      </div>

      <ul className="flex flex-wrap items-center gap-2">
        <JobMatchChip
          label={t(`levels.${level}`)}
          toneClassName={MATCH_LEVEL_STYLES[level].chip}
          iconClassName={MATCH_LEVEL_STYLES[level].icon}
        />
        {job.highlights.map((highlight) => (
          <JobMatchChip key={highlight} label={highlight} />
        ))}
      </ul>

      <div className="h-px bg-border" />

      <div className="grid grid-cols-2 gap-2">
        <Button
          asChild
          className={cn(
            'bg-match-primary text-primary-foreground hover:bg-match-primary/90',
            ACTION_CLASS_NAME,
          )}
        >
          <Link href={href}>{t('apply')}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className={cn('border-border text-foreground', ACTION_CLASS_NAME)}
        >
          <Link href={href}>{t('view-job')}</Link>
        </Button>
      </div>
    </Card>
  );
}
