'use client';

import { CircleEllipsis, ClipboardList, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { AssessmentCategory } from '../types/assessment.types';

type CategoryCardProps = {
  category: AssessmentCategory;
  onEdit?: (category: AssessmentCategory) => void;
  onDelete?: (category: AssessmentCategory) => void;
};

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const t = useTranslations('companyPage.assessments');
  return (
    <Card className="hover:border-primary relative gap-0 overflow-hidden rounded-2xl p-4 shadow-none transition-colors">
      <div className="flex items-start gap-3">
        <span className="bg-primary-bg text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
          <ClipboardList
            aria-hidden="true"
            className="size-6"
            strokeWidth={1.5}
          />
        </span>
        <h3 className="text-secondary min-w-0 flex-1 self-center text-base font-semibold">
          <span className="line-clamp-2">{category.name}</span>
        </h3>
        {category.source === 'company' && onEdit && onDelete ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground relative z-10 size-7 rounded-full"
                aria-label={t('category-actions', { name: category.name })}
              >
                <CircleEllipsis aria-hidden="true" className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(category)}>
                <Pencil aria-hidden="true" />
                {t('edit-action')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onDelete(category)}
              >
                <Trash2 aria-hidden="true" className="text-destructive" />
                {t('delete-action')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <Link
        aria-label={category.name}
        className="focus-visible:after:ring-ring absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:rounded-2xl focus-visible:after:ring-2"
        href={`/company/assessments/${category.id}`}
      />
      <div className="border-border mt-4 border-t pt-4">
        <p className="text-muted-foreground line-clamp-2 min-h-10 text-xs leading-5">
          {category.description}
        </p>
        <p className="text-primary mt-3 text-xs font-semibold">
          {t('assessment-count', { count: category.assessmentCount })}
        </p>
      </div>
    </Card>
  );
}
