'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';

type ExternalInvitationFiltersProps = {
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  project: string;
  onProject: (value: string) => void;
  minScore: string;
  onMinScore: (value: string) => void;
  maxScore: string;
  onMaxScore: (value: string) => void;
};

export default function ExternalInvitationFilters({
  search,
  onSearch,
  status,
  onStatus,
  project,
  onProject,
  minScore,
  onMinScore,
  maxScore,
  onMaxScore,
}: ExternalInvitationFiltersProps) {
  const t = useTranslations('companyPage.assessments.invitations');
  const statusOptions = [
    { value: 'all', label: t('all-statuses') },
    ...['passed', 'failed', 'pending', 'absent'].map((value) => ({
      value,
      label: t(value),
    })),
  ];
  const projects = [
    { value: 'all', label: t('all-projects') },
    { value: 'clinical', label: 'Clinical Assessment' },
    { value: 'nursing', label: 'Nursing Assessment' },
  ];
  return (
    <div className="bg-secondary/4 grid grid-cols-2 gap-2.5 rounded-3xl p-3 lg:grid-cols-[minmax(230px,300fr)_170fr_200fr_145fr_145fr]">
      <div className="relative col-span-2 lg:col-span-1">
        <Search className="text-assessment-primary pointer-events-none absolute start-4 top-1/2 z-10 size-[18px] -translate-y-1/2" />
        <InputField
          id="invitation-search"
          aria-label={t('search')}
          placeholder={t('search')}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="bg-card placeholder:text-muted-foreground/60 h-13 border-none ps-11 text-base shadow-none"
        />
      </div>
      <SelectInputField
        id="invitation-status"
        aria-label={t('all-statuses')}
        options={statusOptions}
        value={status}
        onChange={onStatus}
        className="bg-card text-muted-foreground/60 h-13 rounded-full border-none px-4 text-base"
      />
      <SelectInputField
        id="invitation-project"
        aria-label={t('all-projects')}
        options={projects}
        value={project}
        onChange={onProject}
        className="bg-card text-muted-foreground/60 h-13 rounded-full border-none px-4 text-base"
      />
      <InputField
        id="invitation-min-score"
        type="number"
        min={0}
        max={100}
        aria-label={t('min-score')}
        placeholder={t('min-score')}
        value={minScore}
        onChange={(event) => onMinScore(event.target.value)}
        className="bg-card placeholder:text-muted-foreground/60 h-13 border-none text-base shadow-none"
      />
      <InputField
        id="invitation-max-score"
        type="number"
        min={0}
        max={100}
        aria-label={t('max-score')}
        placeholder={t('max-score')}
        value={maxScore}
        onChange={(event) => onMaxScore(event.target.value)}
        className="bg-card placeholder:text-muted-foreground/60 h-13 border-none text-base shadow-none"
      />
    </div>
  );
}
