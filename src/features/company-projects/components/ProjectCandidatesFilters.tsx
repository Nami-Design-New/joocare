'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Input } from '@/shared/components/ui/input';

type ProjectCandidatesFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export default function ProjectCandidatesFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ProjectCandidatesFiltersProps) {
  const t = useTranslations('companyPage.projects');
  const statusOptions = [
    { value: 'Rejected', label: t('rejected') },
    { value: 'Shortlist', label: t('shortlist') },
    { value: 'Under review', label: t('under-review') },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
      <label className="relative block">
        <Search
          aria-hidden="true"
          className="text-primary absolute top-1/2 left-4 size-5 -translate-y-1/2"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder={t('candidate-search-placeholder')}
          aria-label={t('candidate-search-placeholder')}
          className="bg-card h-[52px] rounded-full border-0 pl-12 shadow-none"
        />
      </label>
      <SelectInputField
        id="project-candidate-status-filter"
        aria-label={t('status-filter')}
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
        placeholder={t('status-filter')}
        allowDeselect
        className="border-border bg-card h-[52px]"
      />
    </div>
  );
}
