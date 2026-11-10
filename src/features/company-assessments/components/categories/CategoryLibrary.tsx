'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Button } from '@/shared/components/ui/button';
import { CATEGORY_PREVIEW_SIZE } from '../../constants/assessment-data';
import type { AssessmentCategory } from '../../types/assessment.types';
import CategoryCard from './CategoryCard';

type CategoryLibraryProps = {
  title: string;
  categories: AssessmentCategory[];
  filterId: string;
  onEdit?: (category: AssessmentCategory) => void;
  onDelete?: (category: AssessmentCategory) => void;
};

export default function CategoryLibrary({
  title,
  categories,
  filterId,
  onEdit,
  onDelete,
}: CategoryLibraryProps) {
  const t = useTranslations('companyPage.assessments');
  const [expanded, setExpanded] = useState(false);
  const visible =
    expanded || filterId
      ? categories
      : categories.slice(0, CATEGORY_PREVIEW_SIZE);
  const ExpandIcon = expanded ? Minus : Plus;

  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-secondary text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {visible.length === 0 ? (
          <EmptyDataState
            title="companyPage.assessments.no-categories"
            className="min-h-48"
          />
        ) : null}
      </div>
      {categories.length > CATEGORY_PREVIEW_SIZE && !filterId ? (
        <div className="flex justify-center pt-3">
          <Button
            className="h-10 gap-2 rounded-full px-6 text-xs"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            <ExpandIcon aria-hidden="true" className="size-4" />
            {t(expanded ? 'show-less' : 'show-more')}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
