import Image from 'next/image';
import { JobDetails } from '../types/jobs.types';
import { getJobSalary } from '../utils';
import { getTranslations } from 'next-intl/server';

export default async function JobLocationAndSalaryCard({
  job,
}: {
  job: JobDetails;
}) {
  const t = await getTranslations();
  return (
    <div className="card flex min-h-36 items-start justify-around rounded-2xl border-2 border-border bg-white px-2 py-5 shadow-card md:px-4 md:py-8 xl:p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-full border-3 border-primary p-1">
          <Image
            src={'/assets/icons/dollar.svg'}
            width={20}
            height={20}
            alt={t('jobDetailsPage.currency-icon')}
          />
        </div>
        <h4 className="text-base font-semibold text-foreground max-md:text-sm max-md:leading-5 md:text-lg">
          {t('jobDetailsPage.salary')}{' '}
          {job?.salary_type === null ? null : job?.currency?.code}
        </h4>
        <p className="text-base font-semibold text-primary max-md:text-sm max-md:leading-5">
          {job.has_salary
            ? getJobSalary(job, t('jobsPage.not-specified'))
            : t('jobsPage.not-specified')}{' '}
        </p>
        <span className="text-sm text-muted-foreground">
          {job.has_salary ? job?.salary_type?.title : ''}
        </span>
      </div>
      <div className="h-full w-0.5 bg-muted"></div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="-mt-[3px] flex items-center justify-center">
          <Image
            src={'/assets/icons/map-pin.svg'}
            width={38}
            height={38}
            alt={t('jobDetailsPage.location-icon')}
          />
        </div>
        <h4 className="text-base font-semibold text-foreground max-md:text-sm max-md:leading-5 md:text-lg">
          {t('jobDetailsPage.job-location')}
        </h4>
        <p className="text-center text-sm font-semibold text-muted-foreground md:text-base">
          {job?.city?.name}
          {job?.city_id === null ? '' : ','}
          <br />
          {job?.country?.name}
        </p>
      </div>
    </div>
  );
}
