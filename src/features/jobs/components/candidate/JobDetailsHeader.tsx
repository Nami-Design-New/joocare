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
    <section className="bg-card flex flex-col justify-between rounded-2xl p-4 lg:flex-row lg:items-center">
      <div className="flex items-center gap-2 lg:gap-6">
        <Image
          src={job?.company?.image ?? '/assets/new-logo-dot.svg'}
          alt={t('jobDetailsPage.company-logo')}
          width={96}
          height={86}
          className="h-22 w-24 rounded-2xl"
        />
        <div>
          <div className="flex items-center gap-4">
            <h6 className="text-foreground text-2xl font-semibold max-md:text-base">
              {jobTitle}
            </h6>
            <JobMatchBadge score={job?.match_score} />
          </div>
          <div className="mt-2 flex items-start gap-2 max-sm:flex-col lg:items-center">
            <div className="text-muted-foreground text-lg font-normal">
              <span>
                {t('jobDetailsPage.at')} {job?.company?.domain?.title}{' '}
              </span>
            </div>
            <Badge
              size="md"
              className="bg-job-type rounded-[3px] font-semibold max-sm:text-[10px]"
            >
              {job?.employment_type?.title}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
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
