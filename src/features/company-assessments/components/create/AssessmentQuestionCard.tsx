'use client';

import { useState } from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import type { BuilderQuestion } from '../../types/assessment-builder.types';
import QuestionPreview from './QuestionPreview';

type AssessmentQuestionCardProps = {
  question: BuilderQuestion;
  number: number;
  onEdit: () => void;
  onDelete: () => void;
};

export default function AssessmentQuestionCard({
  question,
  number,
  onEdit,
  onDelete,
}: AssessmentQuestionCardProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const [expanded, setExpanded] = useState(true);
  return (
    <article className="border-border rounded-2xl border p-4 md:p-6">
      <header className="flex items-center gap-3">
        <span className="bg-primary-bg text-primary rounded-lg p-2 text-sm font-semibold">
          {t('question-number', { number })}
        </span>
        <h2 className="min-w-0 flex-1 truncate text-sm">
          {question.questionText}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-expanded={expanded}
          aria-controls={`question-${question.id}`}
          aria-label={t(expanded ? 'collapse-question' : 'expand-question', {
            number,
          })}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown className={expanded ? 'rotate-180' : ''} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t('edit-question', { number })}
          onClick={onEdit}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          className="rounded-full"
          aria-label={t('delete-question', { number })}
          onClick={onDelete}
        >
          <Trash2 />
        </Button>
      </header>
      {expanded && (
        <div id={`question-${question.id}`} className="mt-4">
          <QuestionPreview question={question} />
        </div>
      )}
    </article>
  );
}
