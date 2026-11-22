'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useCompanyAccess } from '@/features/company/hooks/useCompanyAccess';
import useGetCompanyProfile from '@/features/company-profile/hooks/useGetCompanyProfile';
import { SelectInputField } from '@/shared/components/SelectInputField';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import {
  getCategoryOptionValue,
  useAssessmentCategories,
} from '../../hooks/useAssessmentCategories';
import AssessmentFilter from '../shared/AssessmentFilter';
import AssessmentCategoriesHeader from './AssessmentCategoriesHeader';
import CategoryLibrary from './CategoryLibrary';

export default function AssessmentCategoriesPage() {
  const t = useTranslations('companyPage.assessments');
  const catalog = useAssessmentCategories();
  const { filter } = catalog;
  const { data: session } = useSession();
  const access = useCompanyAccess();
  const { data: company } = useGetCompanyProfile({
    token: session?.accessToken ?? '',
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-10 lg:mt-1">
      <AssessmentCategoriesHeader
        count={catalog.totalCount}
        canCreate={access.can('create-assessment-category')}
        onCreate={catalog.openCreate}
        modal={catalog.modal}
        onCloseModal={catalog.closeModal}
        onSave={catalog.save}
      />

      <AssessmentFilter onReset={filter.onReset}>
        <SelectInputField
          id="assessment-category-filter"
          aria-label={t('filter-category')}
          placeholder={t('category')}
          options={filter.options.map((option) => ({
            label: t('category-option', {
              category: option.name,
              library: option.libraryLabel,
            }),
            value: getCategoryOptionValue(option),
          }))}
          withSearchInput
          value={filter.value}
          onChange={filter.onChange}
          onSearchChange={filter.onSearchChange}
          onReachEnd={filter.onReachEnd}
          hasNextPage={filter.hasNextPage}
          isFetchingNextPage={filter.isFetchingNextPage}
          className="h-13 border-none bg-card text-sm shadow-none"
        />
      </AssessmentFilter>

      <CategoryLibrary
        title={t('joocare-library')}
        library={catalog.joocareLibrary}
      />
      <CategoryLibrary
        title={
          company?.name
            ? t('company-library', { company: company.name })
            : t('your-library')
        }
        library={catalog.companyLibrary}
        onEdit={catalog.openEdit}
        onDelete={catalog.requestDelete}
      />

      <DeleteModal
        open={Boolean(catalog.deletingCategory)}
        onOpenChange={(open) => {
          if (!open && !catalog.isDeleting) catalog.closeDeleteModal();
        }}
        title={t('delete-category-title')}
        description={t('delete-category-description')}
        confirmLabel={t('confirm-deletion')}
        cancelLabel={t('cancel')}
        isLoading={catalog.isDeleting}
        onConfirm={() => void catalog.confirmDelete()}
      />
    </div>
  );
}
