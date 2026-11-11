'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type TalentResultsHeaderProps = {
  count: number;
  selectedCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onMessage: () => void;
};

export default function TalentResultsHeader({
  count,
  selectedCount,
  search,
  onSearchChange,
  onSearch,
  onMessage,
}: TalentResultsHeaderProps) {
  const t = useTranslations('companyPage.talent-database');
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <h1 className="shrink-0 text-xl font-semibold text-muted-foreground sm:text-[28px]">
        <span className="me-2 text-[28px] text-secondary sm:text-4xl">
          {count}
        </span>{' '}
        {t('candidates-cv')}
      </h1>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 xl:flex-nowrap xl:justify-end xl:gap-6">
        <Button
          size="pill"
          onClick={onMessage}
          disabled={!selectedCount}
          className="h-11 shrink-0 gap-2 rounded-full bg-primary px-5 text-sm font-medium disabled:bg-[#83b7aa] disabled:text-white disabled:opacity-100"
        >
          <Image
            src="/assets/company-projects/candidate-share.svg"
            alt=""
            width={14}
            height={14}
          />
          {t('message-selected', { count: selectedCount })}
        </Button>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="flex h-14 w-full max-w-[434px] min-w-[280px] items-center gap-1 rounded-full bg-[#eef0ef] p-1.5"
        >
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder={t('search-placeholder')}
            aria-label={t('search-placeholder')}
            className="h-12 rounded-full border-0 bg-white px-4 text-sm shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="pill"
            className="h-11 shrink-0 rounded-full px-6 text-sm"
          >
            {t('search')}
          </Button>
        </form>
      </div>
    </div>
  );
}
