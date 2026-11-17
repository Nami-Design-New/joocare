'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import HttpStatusState from '@/shared/components/HttpStatusState';
import SearchInput from '@/shared/components/SearchInput';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { ASSESSMENT_PAGE_SIZE } from '../../constants/assessment-data';
import { useCategoryAssessments } from '../../hooks/useCategoryAssessments';
import type { AssessmentSource } from '../../types/assessment.types';
import AssessmentFilter from '../shared/AssessmentFilter';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';
import AssessmentsLoading from '../shared/AssessmentsLoading';
import AssessmentCard from './AssessmentCard';

type CategoryAssessmentsPageProps = {
  categoryId: string;
  source: AssessmentSource;
};

export default function CategoryAssessmentsPage({
  categoryId,
  source,
}: CategoryAssessmentsPageProps) {
  const t = useTranslations('companyPage.assessments');
  const listing = useCategoryAssessments(categoryId, source);
  const { category, assessments } = listing;

  if (category.isPending) return <AssessmentsLoading variant="details" />;

  if (category.isError) {
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

  function renderAssessments() {
    if (assessments.isPending) {
      return Array.from({ length: ASSESSMENT_PAGE_SIZE }, (_, index) => (
        <Skeleton key={index} className="h-80 rounded-3xl" />
      ));
    }
    if (assessments.isError) {
      return (
        <AssessmentsErrorState onRetry={() => void assessments.refetch()} />
      );
    }
    if (!listing.items.length) {
      return (
        <EmptyDataState
          title={
            listing.hasSearch
              ? 'companyPage.assessments.no-search-results'
              : 'companyPage.assessments.no-assessments'
          }
          description={t(
            listing.hasSearch
              ? 'try-another-search'
              : 'empty-category-description',
          )}
        />
      );
    }
    return listing.items.map((assessment) => (
      <AssessmentCard
        key={assessment.id}
        assessment={assessment}
        source={source}
        href={`/company/assessments/${categoryId}/${assessment.id}`}
        isDeleting={listing.isDeleting}
        onDelete={() => listing.deleteAssessment(assessment.id)}
      />
    ));
  }

  return (
    <div className="flex flex-col gap-8 lg:mt-1">
      <header className="flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-semibold text-secondary md:text-[28px]">
            {category.data.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {category.data.description}
          </p>
        </div>
        {source === 'company' ? (
          <Button className="h-10 gap-2 rounded-full px-5" asChild>
            <Link href={`/company/assessments/${categoryId}/create`}>
              <Plus aria-hidden="true" className="size-4" />
              {t('create-assessment')}
            </Link>
          </Button>
        ) : null}
      </header>

      <AssessmentFilter onReset={() => listing.setSearch('')}>
        <SearchInput
          id="assessment-search"
          aria-label={t('search')}
          placeholder={t('search-placeholder')}
          value={listing.search}
          onChange={(event) => listing.setSearch(event.target.value)}
          className="text-sm"
        />
      </AssessmentFilter>

      <section
        id="assessment-list"
        aria-label={t('assessment-list')}
        aria-busy={assessments.isFetching}
        className="grid scroll-mt-24 grid-cols-1 gap-4 xl:grid-cols-2"
      >
        {renderAssessments()}
      </section>

      {listing.total > listing.pageSize ? (
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
