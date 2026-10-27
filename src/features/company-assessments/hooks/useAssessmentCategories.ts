'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { categorySeeds } from '../constants/assessment-data';
import type {
  AssessmentCategory,
  CategoryFormValues,
} from '../types/assessment.types';

export function useAssessmentCategories() {
  const t = useTranslations('companyPage.assessments');
  const [categories, setCategories] = useState(categorySeeds);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [modal, setModal] = useState<{
    category: AssessmentCategory | null;
  } | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<AssessmentCategory | null>(null);
  const visibleCategories = categories.filter(
    (category) => !selectedCategoryId || category.id === selectedCategoryId,
  );

  function save(values: CategoryFormValues) {
    try {
      if (modal?.category) {
        setCategories((current) =>
          current.map((category) =>
            category.id === modal.category?.id
              ? { ...category, ...values }
              : category,
          ),
        );
      } else {
        setCategories((current) => [
          {
            ...values,
            id: `company-${crypto.randomUUID()}`,
            source: 'company',
            assessmentCount: 0,
          },
          ...current,
        ]);
      }
      toast.success(
        t(modal?.category ? 'category-updated' : 'category-created'),
      );
      if (!modal?.category) setSelectedCategoryId('');
      setModal(null);
      return true;
    } catch {
      toast.error(t('save-error'));
      return false;
    }
  }

  function confirmDelete() {
    if (!deletingCategory) return;
    setCategories((current) =>
      current.filter((category) => category.id !== deletingCategory.id),
    );
    if (selectedCategoryId === deletingCategory.id) setSelectedCategoryId('');
    toast.success(t('category-deleted'));
    setDeletingCategory(null);
  }

  return {
    categories,
    joocareCategories: visibleCategories.filter(
      (category) => category.source === 'joocare',
    ),
    companyCategories: visibleCategories.filter(
      (category) => category.source === 'company',
    ),
    selectedCategoryId,
    setSelectedCategoryId,
    modal,
    openCreate: () => setModal({ category: null }),
    openEdit: (category: AssessmentCategory) => setModal({ category }),
    closeModal: () => setModal(null),
    deletingCategory,
    requestDelete: setDeletingCategory,
    closeDeleteModal: () => setDeletingCategory(null),
    confirmDelete,
    save,
  };
}
