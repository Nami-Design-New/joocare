'use client';

import { Plus, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { Button } from '@/shared/components/ui/button';
import { useCategoryAssessments } from '../hooks/useCategoryAssessments';
import { useAssessmentActions } from '../hooks/useAssessmentActions';
import AssessmentFilter from './AssessmentFilter';
import AssessmentCard from './AssessmentCard';

export default function CategoryAssessmentsPage({
  categoryId,
}: {
  categoryId: string;
}) {
  const t = useTranslations('companyPage.assessments');
  const listing = useCategoryAssessments(categoryId);
  const { showComingSoon } = useAssessmentActions();
  const { category } = listing;

  if (!category) {
    return (
      <HttpStatusState
        statusCode={404}
        title={t('category-not-found')}
        description={t('category-not-found-description')}
        primaryHref="/company/assessments"
        primaryLabel={t('back-to-categories')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:mt-1">
      <header className="flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-3xl space-y-2">
          <h1 className="text-secondary text-2xl font-semibold md:text-[28px]">
            {category.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {category.description}
          </p>
        </div>
        {category.source === 'company' ? (
          <Button
            className="h-10 gap-2 rounded-full px-5"
            onClick={showComingSoon}
          >
            <Plus aria-hidden="true" className="size-4" />
            {t('create-assessment')}
          </Button>
        ) : null}
      </header>

      <AssessmentFilter onReset={() => listing.setSearch('')}>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="text-primary pointer-events-none absolute start-4 top-1/2 z-10 size-5 -translate-y-1/2"
          />
          <InputField
            id="assessment-search"
            type="search"
            aria-label={t('search')}
            placeholder={t('search-placeholder')}
            value={listing.search}
            onChange={(event) => listing.setSearch(event.target.value)}
            className="bg-card h-13 border-none ps-12 text-sm shadow-none"
          />
        </div>
      </AssessmentFilter>

      <section
        id="assessment-list"
        aria-label={t('assessment-list')}
        className="grid scroll-mt-24 grid-cols-1 gap-4 xl:grid-cols-2"
      >
        {listing.assessments.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            source={category.source}
          />
        ))}
        {listing.total === 0 ? (
          <EmptyDataState
            title={
              listing.search
                ? 'companyPage.assessments.no-search-results'
                : 'companyPage.assessments.no-assessments'
            }
            description={t(
              listing.search
                ? 'try-another-search'
                : 'empty-category-description',
            )}
          />
        ) : null}
      </section>

      {listing.total > listing.pageSize ||
      (category.source === 'company' && listing.total > 0) ? (
        <CustomPagination
          currentPage={listing.page}
          pageSize={listing.pageSize}
          totalItems={listing.total}
          onPageChange={listing.setPage}
          getHref={() => '#assessment-list'}
          statusPosition="start"
          className="md:justify-start"
        />
      ) : null}
    </div>
  );
}
