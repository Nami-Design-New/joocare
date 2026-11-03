'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/shared/components/ui/input';

type JobSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function JobSearchInput({
  value,
  onChange,
}: JobSearchInputProps) {
  const t = useTranslations('companyPage.jobs.listing');

  return (
    <label className="relative block w-full">
      <Search
        aria-hidden="true"
        className="text-primary absolute start-4 top-1/2 size-4.5 -translate-y-1/2"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={t('search-placeholder')}
        aria-label={t('search-placeholder')}
        className="bg-card h-13 border-0 ps-11 shadow-none"
      />
    </label>
  );
}
