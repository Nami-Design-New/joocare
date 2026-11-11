import Image from 'next/image';
import { JobDetails } from '../../types/jobs.types';
import { getJobSalary } from '../../utils';
import { useTranslations } from 'next-intl';

export default function JobLocationAndSalaryCard({ job }: { job: JobDetails }) {
  const t = useTranslations();
  return (
    <div className="card flex min-h-36 items-center justify-around rounded-2xl border-2 border-border bg-white px-4 py-8 shadow-card xl:p-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-full border-3 border-primary p-1">
          <Image
            src={'/assets/icons/dollar.svg'}
            width={20}
            height={20}
            alt={t('jobDetailsPage.currency-icon')}
          />
        </div>
        <h4 className="text-lg font-semibold text-foreground">
          {t('jobDetailsPage.salary')}{' '}
          {job?.salary_type ? `(${job?.currency?.code})` : ''}
        </h4>
        {job.has_salary ? (
          <p className="text-base font-semibold text-primary">
            {getJobSalary(job)}{' '}
          </p>
        ) : (
          <p className="text-base font-semibold text-primary">
            {t('jobsPage.not-specified')}
          </p>
        )}
        <span className="text-sm text-muted-foreground">
          {job?.salary_type?.title ?? ''}
        </span>
      </div>
      <div className="h-full w-0.5 bg-muted"></div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <div className="mt-3 flex items-center justify-center">
          <Image
            src={'/assets/icons/map-pin.svg'}
            width={38}
            height={38}
            alt={t('jobDetailsPage.location-icon')}
          />
        </div>
        <h4 className="text-lg font-semibold text-foreground">
          {t('jobDetailsPage.job-location')}
        </h4>
        <p className="text-center text-sm font-semibold text-muted-foreground md:text-base">
          {job?.city?.name ?? '-'}
          {job?.city_id === null ? '' : ','}
          <br />
          {job?.country?.name ?? '-'}
        </p>
      </div>
    </div>
  );
}
