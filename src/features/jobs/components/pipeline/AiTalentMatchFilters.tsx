'use client';

import { useTranslations } from 'next-intl';
import { COUNTRIES } from '@/features/company-talent-database/constants/talent-filters';
import SearchInput from '@/shared/components/SearchInput';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import { AI_MATCH_LICENSES, AI_MATCH_ORDERS } from '../../constants';
import type { AiTalentMatchPreview } from '../../hooks/useAiTalentMatchPreview';

type AiTalentMatchFiltersProps = {
  aiMatch: AiTalentMatchPreview;
};

const SELECT_CLASS = 'bg-card h-13 border-0';

export default function AiTalentMatchFilters({
  aiMatch,
}: AiTalentMatchFiltersProps) {
  const t = useTranslations('companyPage.candidates.ai-match');
  const tOptions = useTranslations('companyPage.talent-database.options');

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
      <SearchInput
        value={aiMatch.search}
        onChange={(event) => aiMatch.setSearch(event.target.value)}
        placeholder={t('search-placeholder')}
        iconClassName="size-4.5"
        className="ps-11"
      />
      <SelectInputField
        id="ai-match-order"
        aria-label={t('order')}
        placeholder={t('order')}
        options={AI_MATCH_ORDERS.map((order) => ({
          value: order,
          label: t(`orders.${order}`),
        }))}
        value={aiMatch.filters.order}
        onChange={(value) => aiMatch.setFilter('order', value)}
        className={SELECT_CLASS}
      />
      <SelectInputField
        id="ai-match-country"
        aria-label={t('location')}
        placeholder={t('location')}
        options={COUNTRIES.map((country) => ({
          value: country,
          label: tOptions(country),
        }))}
        value={aiMatch.filters.country}
        onChange={(value) => aiMatch.setFilter('country', value)}
        className={SELECT_CLASS}
      />
      <SelectInputField
        id="ai-match-license"
        aria-label={t('license')}
        placeholder={t('license')}
        options={AI_MATCH_LICENSES.map((license) => ({
          value: license,
          label: t(`licenses.${license}`),
        }))}
        value={aiMatch.filters.license}
        onChange={(value) => aiMatch.setFilter('license', value)}
        className={SELECT_CLASS}
      />
      <Button
        type="button"
        variant="destructive"
        disabled={!aiMatch.hasFilters}
        onClick={aiMatch.reset}
        className="h-13 rounded-full px-6"
      >
        {t('reset')}
      </Button>
    </div>
  );
}
