'use client';

import { JobListItem } from '@/features/jobs/types/jobs.types';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import {
  ArrowRight,
  Briefcase,
  CircleDollarSign,
  MapPin,
  Share,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useJobCardDetails } from '../../hooks/useJobCardDetails';
import { useJobShare } from '../../hooks/useJobShare';
import JobMatchBadge from './JobMatchBadge';
import ToggleSavedJobButton from './ToggleSavedJobButton';

type CandidateJobCardProps = {
  job: JobListItem;
  href?: string;
  appliedBadge?: boolean;
  appliedAtLabel?: string;
  onSavedChange?: (nextSavedState: boolean) => void;
  companyImage?: string;
};

export default function CandidateJobCard({
  job,
  href = '/jobs',
  appliedBadge,
  appliedAtLabel,
  onSavedChange,
  companyImage,
}: CandidateJobCardProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const {
    title,
    company,
    companyLogo,
    postedAt: postedAtLabel,
    location,
    category,
    employmentType,
    salary,
    experience,
    specialty,
    excerpt,
  } = useJobCardDetails(job);
  const sharePath = `/jobs/${job.id}`;

  const shouldShowAppliedBadge = appliedBadge || job.is_applied;
  const appliedLabel = appliedAtLabel || postedAtLabel;
  const { shareJob } = useJobShare({ title, path: sharePath });
  const isEmployer = session?.authRole === 'employer';

  return (
    <Card className="group shadow-xl hover:border-primary">
      <CardHeader className="flex gap-2 max-lg:px-2">
        <Image
          width={52}
          height={46}
          src={companyLogo || companyImage || '/assets/new-logo-dot.svg'}
          alt={t('jobDetailsPage.company-logo')}
          className="h-12 w-14 rounded-2xl"
        />
        <div className="flex grow flex-col gap-1">
          <h6 className="text-sm font-semibold text-secondary group-hover:text-primary md:text-lg">
            <Link href={href}>{title}</Link>
          </h6>
          <p className="text-sm font-normal text-foreground md:text-base">
            {company}
          </p>
          <time className="text-xs font-normal text-muted-foreground">
            {postedAtLabel}
          </time>
        </div>
        <JobMatchBadge score={job.match_score} />
      </CardHeader>
      <CardContent className="grow max-lg:px-2">
        <div className="flex flex-col gap-4">
          <ul className="flex flex-wrap items-start gap-2">
            <li className="flex items-start gap-1 text-xs font-normal text-secondary md:text-sm">
              <MapPin
                size={16}
                color="var(--muted-foreground)"
                className="shrink-0"
              />
              {location}
            </li>
            <li className="flex items-start gap-1 text-xs font-normal text-secondary md:text-sm">
              <Briefcase
                size={16}
                color="var(--muted-foreground)"
                className="shrink-0"
              />
              {category}
            </li>
            <li className="flex items-start gap-1 text-xs font-normal text-secondary md:text-sm">
              <CircleDollarSign
                size={16}
                color="var(--muted-foreground)"
                className="shrink-0"
              />
              {salary}
            </li>
          </ul>
          <ul className="items-cente flex gap-2">
            <li className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-normal text-muted-foreground md:text-xs">
              {experience}
            </li>
            <li className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-normal text-muted-foreground md:text-xs">
              {employmentType}
            </li>
            <li className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-normal text-muted-foreground md:text-xs">
              {specialty}
            </li>
          </ul>
          <div className="prose prose-sm mt-3 max-w-none text-sm md:text-base">
            {excerpt || t('jobsPage.card-description-fallback')}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 max-lg:px-2">
        <div className="flex w-full flex-wrap items-center justify-between gap-2 border-t border-b-border pt-4">
          <div className="flex gap-2">
            {!isEmployer ? (
              <ToggleSavedJobButton
                jobId={job.id}
                initialIsSaved={job.is_saved}
                onSavedChange={onSavedChange}
                className="bg-muted"
              />
            ) : null}
            <Button
              variant="outline"
              size="pill"
              className="h-9 border-border bg-muted px-4 py-2 text-sm text-muted-foreground"
              onClick={() => void shareJob()}
            >
              <Share className="mx-1 size-4 md:size-5" /> {t('jobsPage.share')}
            </Button>
          </div>

          {shouldShowAppliedBadge ? (
            <Button className="flex h-9 cursor-default items-center gap-2 rounded-full border-border bg-primary/10 px-3 py-2 text-sm text-white">
              <span className="font-semibold text-primary">
                {t('jobsPage.applied')}
              </span>
              <span className="grow text-end text-xs text-muted-foreground">
                {appliedLabel}
              </span>
            </Button>
          ) : (
            <Link
              className={`flex h-9 items-center gap-2 rounded-full border-border bg-primary px-3 py-2 text-xs text-white md:text-sm`}
              href={href}
            >
              {t('jobsPage.view-job')}
              <ArrowRight
                size={18}
                strokeWidth={1.5}
                className="size-4 md:size-5 rtl:rotate-180"
              />
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
