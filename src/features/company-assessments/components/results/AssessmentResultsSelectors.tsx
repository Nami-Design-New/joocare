'use client';

import { useTranslations } from 'next-intl';
import { SelectInputField } from '@/shared/components/SelectInputField';

type SelectOption = { value: string; label: string };

type InfiniteOptions = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

type AssessmentResultsSelectorsProps = {
  categoryId: string;
  categoryOptions: SelectOption[];
  categories: InfiniteOptions;
  onCategoryChange: (value: string) => void;
  onCategorySearch: (value: string) => void;
  assessmentId: string;
  assessmentOptions: SelectOption[];
  assessments: InfiniteOptions;
  onAssessmentChange: (value: string) => void;
};

export default function AssessmentResultsSelectors({
  categoryId,
  categoryOptions,
  categories,
  onCategoryChange,
  onCategorySearch,
  assessmentId,
  assessmentOptions,
  assessments,
  onAssessmentChange,
}: AssessmentResultsSelectorsProps) {
  const t = useTranslations('companyPage.assessments.results');

  return (
    <section className="grid gap-4 rounded-3xl bg-secondary/5 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(150px,0.9fr)] lg:items-end lg:gap-3">
      <SelectInputField
        id="assessment-result-category"
        label={t('category-label')}
        aria-label={t('category-label')}
        placeholder={t('select-category')}
        options={categoryOptions}
        value={categoryId}
        onChange={onCategoryChange}
        withSearchInput
        searchPlaceholder={t('search-category')}
        onSearchChange={onCategorySearch}
        hasNextPage={categories.hasNextPage}
        isFetchingNextPage={categories.isFetchingNextPage}
        onReachEnd={() => void categories.fetchNextPage()}
        className="h-11 rounded-full border-none bg-card text-sm"
      />
      <SelectInputField
        id="assessment-result-assessment"
        label={t('assessment-label')}
        aria-label={t('assessment-label')}
        placeholder={t('select-assessment')}
        options={assessmentOptions}
        value={assessmentId}
        onChange={onAssessmentChange}
        disabled={!categoryId}
        hasNextPage={assessments.hasNextPage}
        isFetchingNextPage={assessments.isFetchingNextPage}
        onReachEnd={() => void assessments.fetchNextPage()}
        className="h-11 rounded-full border-none bg-card text-sm"
      />
      <p className="self-center text-xs leading-4 text-assessment-muted lg:pb-2">
        {assessmentId ? t('selected-helper') : t('selection-helper')}
      </p>
    </section>
  );
}
