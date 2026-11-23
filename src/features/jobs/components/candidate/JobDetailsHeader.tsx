import { Badge } from '@/shared/components/ui/badge';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { JobDetails } from '../../types/jobs.types';
import CandidateJobDetailsCardActions from './CandidateJobDetailsCardActions';
import JobMatchBadge from './JobMatchBadge';

type JobDetailsHeaderProps = {
  job: JobDetails;
};

export default async function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  const t = await getTranslations();
  const jobTitle = job?.title ?? job?.job_title?.title ?? '';

  return (
    <section className="flex flex-col justify-between rounded-2xl bg-card p-4 max-md:p-3 lg:flex-row lg:items-center">
      <div className="flex items-center gap-2 max-md:items-start lg:gap-6">
        <Image
          src={job?.company?.image ?? '/assets/new-logo-dot.svg'}
          alt={t('jobDetailsPage.company-logo')}
          width={96}
          height={86}
          className="h-18 w-18 rounded-2xl max-md:size-12 max-md:shrink-0 max-md:object-contain md:h-22 md:w-24"
        />
        <div className="max-md:min-w-0 max-md:flex-1">
          <div className="flex items-center gap-4 max-md:flex-wrap max-md:gap-2">
            <h6 className="text-2xl font-semibold text-foreground max-md:text-sm max-md:leading-5">
              {jobTitle}
            </h6>
            <JobMatchBadge score={job?.match_score} />
          </div>
          <div className="mt-2 flex items-start gap-2 max-md:mt-1 max-md:gap-1 max-sm:flex-col lg:items-center">
            <div className="text-sm font-normal text-muted-foreground max-md:text-xs max-md:leading-4 md:text-lg">
              <span>
                {t('jobDetailsPage.at')} {job?.company?.domain?.title}{' '}
              </span>
            </div>
            <Badge
              size="sm"
              className="rounded-[3px] bg-job-type font-semibold max-sm:text-[10px]"
            >
              {job?.employment_type?.title}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground max-md:text-xs max-md:leading-4">
            {job?.current_status?.updated_at}
          </p>
        </div>
      </div>

      <CandidateJobDetailsCardActions
        jobId={job?.id}
        jobTitle={jobTitle}
        initialIsSaved={job?.is_saved}
        isApplied={job?.is_applied}
        screeningQuestions={job?.screening_questions}
        assessment={job?.assessment}
      />
    </section>
  );
}
