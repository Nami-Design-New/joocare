'use client';

import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import SearchInput from '@/shared/components/SearchInput';
import { SelectInputField } from '@/shared/components/SelectInputField';
import type { InvitationStatus } from '../../types/assessment-invitation.types';

const DEFAULT_STATUSES: InvitationStatus[] = [
  'passed',
  'failed',
  'pending',
  'absent',
];

type ExternalInvitationFiltersProps = {
  statuses?: InvitationStatus[];
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  project: string;
  onProject: (value: string) => void;
  /** Company projects (`projects-list`), loaded page by page. */
  projectOptions: { value: string; label: string }[];
  hasMoreProjects?: boolean;
  isLoadingMoreProjects?: boolean;
  onLoadMoreProjects?: () => void;
  minScore: string;
  onMinScore: (value: string) => void;
  maxScore: string;
  onMaxScore: (value: string) => void;
};

export default function ExternalInvitationFilters({
  statuses = DEFAULT_STATUSES,
  search,
  onSearch,
  status,
  onStatus,
  project,
  onProject,
  projectOptions,
  hasMoreProjects = false,
  isLoadingMoreProjects = false,
  onLoadMoreProjects,
  minScore,
  onMinScore,
  maxScore,
  onMaxScore,
}: ExternalInvitationFiltersProps) {
  const t = useTranslations('companyPage.assessments.invitations');
  const statusOptions = [
    { value: 'all', label: t('all-statuses') },
    ...statuses.map((value) => ({
      value,
      label: t(value),
    })),
  ];
  const projects = [
    { value: 'all', label: t('all-projects') },
    ...projectOptions,
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5 rounded-3xl bg-secondary/4 p-3 lg:grid-cols-[minmax(230px,300fr)_170fr_200fr_145fr_145fr]">
      <SearchInput
        id="invitation-search"
        placeholder={t('search')}
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        containerClassName="col-span-2 lg:col-span-1"
        iconClassName="text-assessment-primary size-4.5"
        className="ps-11 text-base placeholder:text-muted-foreground/60"
      />
      <SelectInputField
        id="invitation-status"
        aria-label={t('all-statuses')}
        options={statusOptions}
        value={status}
        onChange={onStatus}
        className="h-13 rounded-full border-none bg-card px-4 text-base text-muted-foreground/60"
      />
      <SelectInputField
        id="invitation-project"
        aria-label={t('all-projects')}
        options={projects}
        value={project}
        onChange={onProject}
        hasNextPage={hasMoreProjects}
        isFetchingNextPage={isLoadingMoreProjects}
        onReachEnd={onLoadMoreProjects}
        className="h-13 rounded-full border-none bg-card px-4 text-base text-muted-foreground/60"
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
        className="h-13 border-none bg-card text-base shadow-none placeholder:text-muted-foreground/60"
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
        className="h-13 border-none bg-card text-base shadow-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
