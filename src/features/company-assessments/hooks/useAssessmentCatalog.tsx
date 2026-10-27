'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { categorySeeds } from '../constants/assessment-data';
import type {
  AssessmentCategory,
  CategoryFormValues,
} from '../types/assessment.types';

type AssessmentCatalog = {
  categories: AssessmentCategory[];
  saveCategory: (values: CategoryFormValues, id?: string) => void;
  deleteCategory: (id: string) => void;
};

const AssessmentCatalogContext = createContext<AssessmentCatalog | null>(null);

export function AssessmentCatalogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [customCategories, setCustomCategories] = useState<
    AssessmentCategory[]
  >([]);
  const [edits, setEdits] = useState<
    Partial<Record<string, CategoryFormValues>>
  >({});
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const categories = useMemo(
    () =>
      [
        ...customCategories.map((category) => ({
          ...category,
          ...edits[category.id],
        })),
        ...categorySeeds.map((category) => ({
          ...category,
          ...edits[category.id],
        })),
      ].filter((category) => !deletedIds.includes(category.id)),
    [customCategories, edits, deletedIds],
  );

  function saveCategory(values: CategoryFormValues, id?: string) {
    if (id) {
      if (
        !categories.some(
          (category) => category.id === id && category.source === 'company',
        )
      ) {
        throw new Error('Category cannot be edited.');
      }
      setEdits((current) => ({ ...current, [id]: values }));
      return;
    }
    setCustomCategories((current) => [
      {
        ...values,
        id: `company-${crypto.randomUUID()}`,
        source: 'company',
        assessmentCount: 0,
      },
      ...current,
    ]);
  }

  function deleteCategory(id: string) {
    if (
      !categories.some(
        (category) => category.id === id && category.source === 'company',
      )
    ) {
      throw new Error('Category cannot be deleted.');
    }
    setDeletedIds((current) => [...current, id]);
    setCustomCategories((current) =>
      current.filter((category) => category.id !== id),
    );
  }

  return (
    <AssessmentCatalogContext.Provider
      value={{ categories, saveCategory, deleteCategory }}
    >
      {children}
    </AssessmentCatalogContext.Provider>
  );
}

export function useAssessmentCatalog() {
  const context = useContext(AssessmentCatalogContext);
  if (!context) throw new Error('AssessmentCatalogProvider is required.');
  return context;
}
