'use client';

import { ChevronDown, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type { ScreeningQuestion } from '../../types/job-steps.types';
import ScreeningQuestionForm from './ScreeningQuestionForm';

type ScreeningQuestionCardProps = {
  question: ScreeningQuestion;
  number: number;
  isExpanded: boolean;
  isHighlighted: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onSave: (question: ScreeningQuestion) => void;
};

// Added question card: closed (11073:44432) / expanded inline edit (11073:44433).
export default function ScreeningQuestionCard({
  question,
  number,
  isExpanded,
  isHighlighted,
  onToggle,
  onDelete,
  onSave,
}: ScreeningQuestionCardProps) {
  const t = useTranslations('companyPage.postJob.questions');

  return (
    <article
      className={cn(
        'border-border rounded-2xl border p-4 transition-colors',
        isHighlighted ? 'bg-primary-bg' : 'bg-card',
      )}
    >
      <div className="flex items-center gap-4">
        <span className="bg-primary-bg text-primary flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
          Q{number}
        </span>
        <p className="text-foreground min-w-0 flex-1 truncate text-sm">
          {isExpanded ? null : question.question}
        </p>
        <button
          type="button"
          onClick={onDelete}
          aria-label={t('delete-question', { number })}
          className="bg-destructive flex size-10 shrink-0 items-center justify-center rounded-full text-white"
        >
          <Trash2 aria-hidden="true" className="size-4.5" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-label={t(isExpanded ? 'collapse-question' : 'expand-question', { number })}
          className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full"
        >
          <ChevronDown
            aria-hidden="true"
            className={cn('size-5 transition-transform', isExpanded && 'rotate-180')}
          />
        </button>
      </div>
      {isExpanded ? (
        <div className="mt-4">
          <ScreeningQuestionForm
            idPrefix={`screening-question-${question.id}`}
            question={question}
            variant="edit"
            onCancel={onToggle}
            onSubmit={onSave}
          />
        </div>
      ) : null}
    </article>
  );
}
