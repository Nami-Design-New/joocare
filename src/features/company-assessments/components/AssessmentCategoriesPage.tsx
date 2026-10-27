'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useGetCompanyProfile from '@/features/company-profile/hooks/useGetCompanyProfile';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import { useAssessmentCategories } from '../hooks/useAssessmentCategories';
import AssessmentFilter from './AssessmentFilter';
import CategoryLibrary from './CategoryLibrary';
import CategoryFormModal from './CategoryFormModal';
import DeleteModal from '@/shared/components/modals/DeleteModal';

export default function AssessmentCategoriesPage() {
  const t = useTranslations('companyPage.assessments');
  const catalog = useAssessmentCategories();
  const { data: session } = useSession();
  const { data: company } = useGetCompanyProfile({
    token: session?.accessToken ?? '',
  });

  return (
    <div className="flex flex-col gap-10 lg:mt-1">
      <header className="flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-3xl space-y-2">
          <h1 className="text-secondary text-2xl font-semibold md:text-[28px]">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
        </div>
        <Button
          className="h-10 gap-2 rounded-full px-5"
          onClick={catalog.openCreate}
        >
          <Plus aria-hidden="true" className="size-4" />
          {t('new-category')}
        </Button>
      </header>

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

      {catalog.modal ? (
        <CategoryFormModal
          key={catalog.modal.category?.id ?? 'new-category'}
          category={catalog.modal.category}
          onClose={catalog.closeModal}
          onSave={catalog.save}
        />
      ) : null}
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
