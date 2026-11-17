'use client';

import { useState } from 'react';
import { ASSESSMENT_SEARCH_DEBOUNCE_MS } from '../constants/assessment-queries';
import type {
  AssessmentCategory,
  AssessmentCategoryOption,
  AssessmentSource,
  CategoryFormValues,
} from '../types/assessment.types';
import { useDebouncedValue } from './useDebouncedValue';
import { useDeleteAssessmentCategory } from './useDeleteAssessmentCategory';
import { useGetAssessmentCategories } from './useGetAssessmentCategories';
import { useGetAssessmentCategory } from './useGetAssessmentCategory';
import { useGetAssessmentCategoryOptions } from './useGetAssessmentCategoryOptions';
import { useSaveAssessmentCategory } from './useSaveAssessmentCategory';

export type CategoryLibraryState = {
  categories: AssessmentCategory[];
  isLoading: boolean;
  isError: boolean;
  isFiltered: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
};

export function getCategoryOptionValue(option: AssessmentCategoryOption) {
  return `${option.source}-${option.id}`;
}

export function useAssessmentCategories() {
  const [optionSearch, setOptionSearch] = useState('');
  const debouncedSearch = useDebouncedValue(
    optionSearch,
    ASSESSMENT_SEARCH_DEBOUNCE_MS,
  );
  const [selectedOption, setSelectedOption] =
    useState<AssessmentCategoryOption | null>(null);
  const [modal, setModal] = useState<{
    category: AssessmentCategory | null;
  } | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<AssessmentCategory | null>(null);

  const joocare = useGetAssessmentCategories('joocare');
  const company = useGetAssessmentCategories('company');
  const categoryOptions = useGetAssessmentCategoryOptions(debouncedSearch);
  const selected = useGetAssessmentCategory(
    selectedOption?.id ?? null,
    selectedOption?.source ?? 'company',
  );
  const saveCategory = useSaveAssessmentCategory();
  const deleteCategory = useDeleteAssessmentCategory();

  // Keep the chosen option in the list so its label stays visible after a new search.
  const options =
    selectedOption &&
    !categoryOptions.options.some(
      (option) =>
        getCategoryOptionValue(option) ===
        getCategoryOptionValue(selectedOption),
    )
      ? [selectedOption, ...categoryOptions.options]
      : categoryOptions.options;

  function buildLibrary(
    source: AssessmentSource,
    query: typeof joocare,
  ): CategoryLibraryState {
    if (selectedOption) {
      const isSelectedSource = selectedOption.source === source;
      return {
        categories: isSelectedSource && selected.data ? [selected.data] : [],
        isLoading: isSelectedSource && selected.isPending,
        isError: isSelectedSource && selected.isError,
        isFiltered: true,
        hasNextPage: false,
        isFetchingNextPage: false,
        onLoadMore: () => undefined,
        onRetry: () => void selected.refetch(),
      };
    }
    return {
      categories: query.categories,
      isLoading: query.isPending,
      isError: query.isError,
      isFiltered: false,
      hasNextPage: query.hasNextPage,
      isFetchingNextPage: query.isFetchingNextPage,
      onLoadMore: () => void query.fetchNextPage(),
      onRetry: () => void query.refetch(),
    };
  }

  function selectOption(value: string) {
    setSelectedOption(
      options.find((option) => getCategoryOptionValue(option) === value) ??
        null,
    );
  }

  function resetFilter() {
    setSelectedOption(null);
    setOptionSearch('');
  }

  async function save(values: CategoryFormValues) {
    const categoryId = modal?.category?.id ?? null;
    try {
      await saveCategory.mutateAsync({ categoryId, values });
      if (!categoryId) resetFilter();
      setModal(null);
      return true;
    } catch {
      return false;
    }
  }

  async function confirmDelete() {
    if (!deletingCategory) return;
    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      if (
        selectedOption?.source === 'company' &&
        selectedOption.id === deletingCategory.id
      )
        resetFilter();
      setDeletingCategory(null);
    } catch {
      // The mutation hook shows the error toast; keep the dialog open to retry.
    }
  }

  return {
    totalCount: joocare.total + company.total,
    joocareLibrary: buildLibrary('joocare', joocare),
    companyLibrary: buildLibrary('company', company),
    filter: {
      options,
      value: selectedOption ? getCategoryOptionValue(selectedOption) : '',
      onChange: selectOption,
      onSearchChange: setOptionSearch,
      hasNextPage: categoryOptions.hasNextPage,
      isFetchingNextPage: categoryOptions.isFetchingNextPage,
      onReachEnd: () => void categoryOptions.fetchNextPage(),
      onReset: resetFilter,
    },
    modal,
    openCreate: () => setModal({ category: null }),
    openEdit: (category: AssessmentCategory) => setModal({ category }),
    closeModal: () => setModal(null),
    save,
    deletingCategory,
    isDeleting: deleteCategory.isPending,
    requestDelete: setDeletingCategory,
    closeDeleteModal: () => setDeletingCategory(null),
    confirmDelete,
  };
}
