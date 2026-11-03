'use client';

import { useTranslations } from 'next-intl';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { ALL_RECRUITERS_VALUE, RECRUITER_FILTER_PREVIEW } from '../constants';

type JobRecruiterFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function JobRecruiterFilter({
  value,
  onChange,
}: JobRecruiterFilterProps) {
  const t = useTranslations('companyPage.jobs.listing');
  const options = [
    { value: ALL_RECRUITERS_VALUE, label: t('all-recruiters') },
    ...RECRUITER_FILTER_PREVIEW.map((name) => ({ value: name, label: name })),
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
