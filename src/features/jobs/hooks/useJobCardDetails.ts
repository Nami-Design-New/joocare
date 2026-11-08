'use client';

import { useTranslations } from 'next-intl';
import { htmlToText } from '@/shared/lib/truncateHtml';
import type { JobListItem } from '../types/jobs.types';
import { getJobLocation, getJobSalaryWithCurrency } from '../utils';

const EXCERPT_LENGTH = 70;

// Display values of a job card, with translated fallbacks for missing data.
export function useJobCardDetails(job: JobListItem) {
  const t = useTranslations('jobsPage');
  const notSpecified = t('not-specified');

  return {
    title: job.title || job.job_title?.title || t('healthcare-opportunity'),
    company: job.company?.name || t('joocare-employer'),
    companyLogo: job.company?.image,
    postedAt: job.current_status?.updated_at,
    location: getJobLocation(job, t('location-not-specified')),
    category: job.category?.title || job.category_title || notSpecified,
    employmentType: job.employment_type?.title || notSpecified,
    salary: getJobSalaryWithCurrency(job, notSpecified),
    experience:
      job.experience?.title ||
      job.experience_title ||
      t('experience-not-specified'),
    specialty: job.specialty?.title || job.specialty_title || t('healthcare'),
    excerpt: htmlToText(job.description || '').slice(0, EXCERPT_LENGTH),
  };
}
