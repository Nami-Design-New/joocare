import { getTranslations } from 'next-intl/server';
import { JobDetails } from '../types/jobs.types';
import DescriptionSection from './DescriptionSection';
import ItemList from './ItemList';
import JobAttachmentsCard from './JobAttachmentsCard';
import JobPostedByCard from './JobPostedByCard';

type JobDescriptionCardProps = {
  job: JobDetails;
  showEmployerDetails?: boolean;
};

export default async function JobDescriptionCard({
  job,
  showEmployerDetails = true,
}: JobDescriptionCardProps) {
  const t = await getTranslations();

  return (
    <div className="card col-span-2 rounded-2xl bg-body-bg p-2 font-noto-sans text-foreground md:p-7">
      <h3 className="mb-4 text-lg font-bold text-primary max-md:text-base max-md:leading-6 md:text-xl">
        {t('jobDetailsPage.job-description')}
      </h3>

      <DescriptionSection title={t('jobDetailsPage.qualifications')}>
        <div
          className="prose prose-sm max-w-none border-b pb-5 text-sm max-md:text-3.25 max-md:leading-5.25 md:text-base"
          dangerouslySetInnerHTML={{
            __html:
              job.description ||
              `<p>${t('jobDetailsPage.no-description-available')}</p>`,
          }}
        />
      </DescriptionSection>

      <div>
        <h3 className="font-outfit text-lg font-bold text-primary max-md:text-base max-md:leading-6 md:text-xl">
          {t('jobDetailsPage.skills')}
        </h3>
        <ItemList items={job?.skills} variant="dashed" />
      </div>

      {showEmployerDetails ? (
        <div className="mt-6 flex flex-col gap-4 empty:hidden">
          <JobAttachmentsCard
            questions={job.screening_questions}
            assessment={job.assessment}
          />
          {job.created_by ? (
            <JobPostedByCard
              creator={job.created_by}
              createdAt={job.created_at}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
