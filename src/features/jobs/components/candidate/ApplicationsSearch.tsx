'use client';

import { useTranslations } from 'next-intl';
import SearchInput from '@/shared/components/SearchInput';
import { useApplicationsSearch } from '../../hooks/useApplicationsSearch';
import ApplicationIcon from './ApplicationIcon';

type ApplicationsSearchProps = { search: string };

export default function ApplicationsSearch({
  search,
}: ApplicationsSearchProps) {
  const t = useTranslations('candidatePage.applications');
  const state = useApplicationsSearch(search);
  return (
    <SearchInput
      value={state.value}
      onChange={(event) => state.setValue(event.target.value)}
      placeholder={t('search-placeholder')}
      aria-busy={state.pending}
      icon={<ApplicationIcon name="search" size={18} />}
      className="h-13 rounded-full border border-border bg-foreground/5 text-base"
    />
  );
}
