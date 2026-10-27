'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useGetCompanyProfile from '@/features/company-profile/hooks/useGetCompanyProfile';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { useAssessmentCategories } from '../hooks/useAssessmentCategories';
import AssessmentFilter from './AssessmentFilter';
import CategoryLibrary from './CategoryLibrary';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import AssessmentCategoriesHeader from './AssessmentCategoriesHeader';

export default function AssessmentCategoriesPage() {
  const t = useTranslations('companyPage.assessments');
  const catalog = useAssessmentCategories();
  const { data: session } = useSession();
  const { data: company } = useGetCompanyProfile({
    token: session?.accessToken ?? '',
  });

  return (
    <div className="flex flex-col gap-10 lg:mt-1">
      <AssessmentCategoriesHeader
        count={catalog.categories.length}
        onCreate={catalog.openCreate}
        modal={catalog.modal}
        onCloseModal={catalog.closeModal}
        onSave={catalog.save}
      />

      {/* filter */}
      <AssessmentFilter onReset={() => catalog.setSelectedCategoryId('')}>
        <SelectInputField
          id="assessment-category-filter"
          aria-label={t('filter-category')}
          placeholder={t('category')}
          options={catalog.categories.map((category) => ({
            label: t('category-option', {
              category: category.name,
              library: t(
                category.source === 'joocare'
                  ? 'joocare-library'
                  : 'your-library',
              ),
            }),
            value: category.id,
          }))}
          withSearchInput
          value={catalog.selectedCategoryId}
          onChange={catalog.setSelectedCategoryId}
          className="bg-card h-13 border-none text-sm shadow-none"
        />
      </AssessmentFilter>

      {/* category libraries */}
      <CategoryLibrary
        title={t('joocare-library')}
        categories={catalog.joocareCategories}
        filterId={catalog.selectedCategoryId}
      />
      <CategoryLibrary
        title={
          company?.name
            ? t('company-library', { company: company.name })
            : t('your-library')
        }
        categories={catalog.companyCategories}
        filterId={catalog.selectedCategoryId}
        onEdit={catalog.openEdit}
        onDelete={catalog.requestDelete}
      />

      {/* modals */}
      <DeleteModal
        open={Boolean(catalog.deletingCategory)}
        onOpenChange={(open) => {
          if (!open) catalog.closeDeleteModal();
        }}
        title={t('delete-category-title')}
        description={t('delete-category-description')}
        confirmLabel={t('confirm-deletion')}
        cancelLabel={t('cancel')}
        onConfirm={catalog.confirmDelete}
      />
    </div>
  );
}
