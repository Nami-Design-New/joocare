'use client';

import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type { ScreeningQuestion } from '../../types/job-steps.types';
import ScreeningQuestionPreview from './ScreeningQuestionPreview';

type ScreeningQuestionCardProps = {
  question: ScreeningQuestion;
  number: number;
  isExpanded: boolean;
  isHighlighted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

// Added question card: closed (11073:44432) / expanded read-only preview
// (11073:44433). Editing always opens ScreeningQuestionModal — the preview
// itself is never editable in place.
export default function ScreeningQuestionCard({
  question,
  number,
  isExpanded,
  isHighlighted,
  onToggle,
  onEdit,
  onDelete,
}: ScreeningQuestionCardProps) {
  const t = useTranslations('companyPage.postJob.questions');

  return (
    <article
      className={cn(
        'rounded-2xl border border-border p-4 transition-colors',
        isHighlighted ? 'bg-primary-bg' : 'bg-card',
      )}
    >
      <div className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-bg text-sm font-semibold text-primary">
          Q{number}
        </span>
        <p className="min-w-0 flex-1 truncate text-sm text-foreground">
          {isExpanded ? null : question.question}
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-label={t(isExpanded ? 'collapse-question' : 'expand-question', {
            number,
          })}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"
        >
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'size-5 transition-transform',
              isExpanded && 'rotate-180',
            )}
          />
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label={t('edit-question', { number })}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border"
        >
          <Pencil aria-hidden="true" className="size-4.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={t('delete-question', { number })}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive text-white"
        >
          <Trash2 aria-hidden="true" className="size-4.5" />
        </button>
      </div>
      {isExpanded ? (
        <div className="mt-4">
          <ScreeningQuestionPreview question={question} />
        </div>
      ) : null}
    </article>
  );
}
