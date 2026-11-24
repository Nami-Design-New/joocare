'use client';

import { useTranslations } from 'next-intl';
import { useGetRecruiterOptions } from '@/features/company-recruiter-activity/hooks/useGetRecruiterOptions';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { ALL_RECRUITERS_VALUE } from '../constants';

type JobRecruiterFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function JobRecruiterFilter({
  value,
  onChange,
}: JobRecruiterFilterProps) {
  const t = useTranslations('companyPage.jobs.listing');
  const { data: recruiters = [] } = useGetRecruiterOptions();
  const options = [
    { value: ALL_RECRUITERS_VALUE, label: t('all-recruiters') },
    ...recruiters.map((recruiter) => ({
      value: String(recruiter.id),
      label: recruiter.name,
    })),
  ];

  return (
    <SelectInputField
      id="job-recruiter-filter"
      aria-label={t('recruiter-filter')}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t('recruiter-filter')}
      className="bg-white"
    />
  );
}
