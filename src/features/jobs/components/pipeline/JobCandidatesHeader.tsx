'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useGetCompanyJob } from '../../hooks/useGetCompanyJob';
import PositionCard from '../PositionCard';

const LOGO_FALLBACK = '/assets/new-logo-dot.svg';

type JobCandidatesHeaderProps = {
  jobId: number;
};

export default function JobCandidatesHeader({
  jobId,
}: JobCandidatesHeaderProps) {
  const t = useTranslations();
  const { data: job, isLoading } = useGetCompanyJob(jobId);

  if (isLoading) return <Skeleton className="h-22 w-full max-w-md rounded-2xl" />;

  return (
    <PositionCard
      logoSrc={job?.company?.image || LOGO_FALLBACK}
      title={
        job?.title ??
        job?.job_title?.title ??
        t('companyPage.jobDetails.untitled-job')
      }
      company={job?.company?.name ?? t('companyPage.jobDetails.your-company')}
      employmentType={
        job?.employment_type?.title ?? t('jobsPage.not-specified')
      }
    />
  );
}
