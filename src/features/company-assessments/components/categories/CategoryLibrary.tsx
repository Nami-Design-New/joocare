'use client';

import { useState } from 'react';
import { LoaderCircle, Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { CATEGORY_PREVIEW_SIZE } from '../../constants/assessment-data';
import type { CategoryLibraryState } from '../../hooks/useAssessmentCategories';
import type { AssessmentCategory } from '../../types/assessment.types';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';
import CategoryCard from './CategoryCard';

type CategoryLibraryProps = {
  title: string;
  library: CategoryLibraryState;
  onEdit?: (category: AssessmentCategory) => void;
  onDelete?: (category: AssessmentCategory) => void;
};

export default function CategoryLibrary({
  title,
  library,
  onEdit,
  onDelete,
}: CategoryLibraryProps) {
  const t = useTranslations('companyPage.assessments');
  const [expanded, setExpanded] = useState(false);
  const { categories, isFiltered, hasNextPage, isFetchingNextPage } = library;
  const showAll = expanded || isFiltered;
  const visible = showAll
    ? categories
    : categories.slice(0, CATEGORY_PREVIEW_SIZE);
  const canExpand =
    !isFiltered && (categories.length > CATEGORY_PREVIEW_SIZE || hasNextPage);
  const loadsMore = !expanded || hasNextPage;
  const ExpandIcon = loadsMore ? Plus : Minus;

  function toggle() {
    if (!expanded) {
      setExpanded(true);
      if (categories.length <= CATEGORY_PREVIEW_SIZE) library.onLoadMore();
      return;
    }
    if (hasNextPage) library.onLoadMore();
    else setExpanded(false);
  }

  function renderContent() {
    if (library.isLoading) {
      return Array.from({ length: CATEGORY_PREVIEW_SIZE }, (_, index) => (
        <Skeleton key={index} className="h-44 rounded-2xl" />
      ));
    }
    if (library.isError) {
      return <AssessmentsErrorState onRetry={library.onRetry} />;
    }
    if (!visible.length) {
      return (
        <EmptyDataState
          title="companyPage.assessments.no-categories"
          className="min-h-48"
        />
      );
    }
    return visible.map((category) => (
      <CategoryCard
        key={category.id}
        category={category}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ));
  }

  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-lg font-semibold text-secondary">{title}</h2>
      <div
        aria-busy={library.isLoading || isFetchingNextPage}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {renderContent()}
      </div>
      {canExpand && !library.isLoading && !library.isError ? (
        <div className="flex justify-center pt-3">
          <Button
            className="h-10 gap-2 rounded-full px-6 text-xs"
            aria-expanded={expanded}
            disabled={isFetchingNextPage}
            onClick={toggle}
          >
            {isFetchingNextPage ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : (
              <ExpandIcon aria-hidden="true" className="size-4" />
            )}
            {t(loadsMore ? 'show-more' : 'show-less')}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
