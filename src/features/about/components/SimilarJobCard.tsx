import JobMatchBadge from '@/features/jobs/components/candidate/JobMatchBadge';
import { SimilarJob } from '@/features/jobs/types/jobs.types';
import { getJobSalary } from '@/features/jobs/utils';
import { Link } from '@/i18n/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import { Briefcase, CircleDollarSign, LocationEdit, Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type SimilarJobCardProps = {
  job: SimilarJob;
};

export default function SimilarJobCard({ job }: SimilarJobCardProps) {
  const t = useTranslations();

  return (
    <Card className="hover:border-primary h-full gap-2 hover:border">
      <CardHeader className="flex gap-2">
        <Image
          width={52}
          height={46}
          src={job?.company?.image ?? '/assets/new-logo-dot.svg'}
          alt={t('jobDetailsPage.company-logo')}
          className="h-12 w-14 rounded-2xl"
        />
        <div className="flex grow flex-col gap-1">
          <p className="text-foreground text-md font-normal">
            {job?.title === null ? job?.job_title?.title : job?.title}
          </p>
          <p className="text-foreground text-md font-normal">
            {job?.company?.name}
          </p>
        </div>
        <JobMatchBadge score={job.match_score} />
      </CardHeader>
      <CardContent>
        <Link
          href={`/jobs/${job.id}`}
          className="flex cursor-pointer flex-col gap-2"
        >
          <ul className="flex items-start gap-2">
            <li className="text-secondary flex items-start gap-1 text-sm font-normal">
              <LocationEdit size={14} color="var(--muted-foreground)" />
              {job?.city?.name ? `${job?.city?.name} ,` : ''}
              {job?.country?.name}
            </li>
            <li className="text-secondary flex items-start gap-1 text-sm font-normal">
              <Briefcase size={14} color="var(--muted-foreground)" />
              {job?.category?.title ??
                job?.category_title ??
                t('jobsPage.not-specified')}{' '}
            </li>
            <li className="text-secondary flex items-start gap-1 text-sm font-normal">
              <CircleDollarSign size={14} color="var(--muted-foreground)" />
              {getJobSalary(job, t('jobsPage.not-specified'))}
            </li>
          </ul>
          <ul className="flex items-center gap-2">
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {job?.experience?.title ??
                job?.experience_title ??
                t('jobsPage.not-specified')}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {job?.employment_type?.title}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {job?.specialty?.title ??
                job?.specialty_title ??
                t('jobsPage.not-specified')}
            </li>
          </ul>
          <div
            className="text-muted-foreground line-clamp-1"
            dangerouslySetInnerHTML={{
              __html:
                job?.description ||
                `<p>${t('jobDetailsPage.no-description-available')}</p>`,
            }}
          />
        </Link>
      </CardContent>
      <CardFooter>
        <p className="text-foreground flex items-center gap-1 text-sm">
          <Timer size={16} /> {job?.created_at}
        </p>
      </CardFooter>
    </Card>
  );
}
