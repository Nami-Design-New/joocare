'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';
import CategoryFormModal from './CategoryFormModal';
import type {
  AssessmentCategory,
  CategoryFormValues,
} from '../types/assessment.types';

export default function AssessmentCategoriesHeader({
  count,
  onCreate,
  modal,
  onCloseModal,
  onSave,
}: {
  count: number;
  onCreate: () => void;
  modal: { category: AssessmentCategory | null } | null;
  onCloseModal: () => void;
  onSave: (values: CategoryFormValues) => boolean;
}) {
  const t = useTranslations('companyPage.assessments');

  return (
    <>
      <div className="space-y-2">
        <CountPageHeader
          count={count}
          title={t('title')}
          className="flex-wrap"
          action={{
            label: t('new-category'),
            icon: <Plus aria-hidden="true" className="size-4" />,
            onClick: onCreate,
          }}
        />
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>
      {modal ? (
        <CategoryFormModal
          key={modal.category?.id ?? 'new-category'}
          category={modal.category}
          onClose={onCloseModal}
          onSave={onSave}
        />
      ) : null}
    </>
  );
}
