'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useProfileViewersSearch } from '../hooks/useProfileViewersSearch';

type ProfileViewersSearchProps = {
  search: string;
};

// "Search by company name…" pill with the Search button inside.
export default function ProfileViewersSearch({
  search,
}: ProfileViewersSearchProps) {
  const t = useTranslations('candidatePage.profileInsights');
  const state = useProfileViewersSearch(search);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        state.submit();
      }}
      className="bg-foreground/2 border-border flex w-full max-w-136.5 items-center gap-1 rounded-full border p-2"
    >
      <Input
        type="search"
        value={state.value}
        onChange={(event) => state.setValue(event.target.value)}
        placeholder={t('search-placeholder')}
        aria-label={t('search-placeholder')}
        className="bg-card border-border h-13 flex-1 rounded-full px-4 text-base shadow-none"
      />
      <Button
        type="submit"
        disabled={state.pending}
        className="bg-assessment-primary hover:bg-assessment-primary/90 h-9.5 shrink-0 rounded-full px-5 text-sm font-normal"
      >
        {t('search')}
      </Button>
    </form>
  );
}
