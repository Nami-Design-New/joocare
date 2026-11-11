'use client';

import { useTranslations } from 'next-intl';
import SearchInput from '@/shared/components/SearchInput';
import { SelectInputField } from '@/shared/components/SelectInputField';

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
      <SearchInput
        value={search}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        placeholder={t('candidate-search-placeholder')}
      />
      <SelectInputField
        id="project-candidate-status-filter"
        aria-label={t('status-filter')}
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
        placeholder={t('status-filter')}
        allowDeselect
        className="h-13 border-border bg-card"
      />
    </div>
  );
}
