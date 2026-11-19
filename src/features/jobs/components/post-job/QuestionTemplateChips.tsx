'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { TEMPLATES_PREVIEW_COUNT } from '../../constants';
import type { QuestionTemplateHint } from '../../types/jobs.types';

type QuestionTemplateChipsProps = {
  hints: QuestionTemplateHint[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isAtLimit: boolean;
  addedIds: string[];
  previewId: string | null;
  onSelect: (templateId: string) => void;
};

// Template chips with Show More / Show Less (Figma 10181:44166).
export default function QuestionTemplateChips({
  hints,
  isLoading,
  isError,
  onRetry,
  isAtLimit,
  addedIds,
  previewId,
  onSelect,
}: QuestionTemplateChipsProps) {
  const t = useTranslations('companyPage.postJob.questions');
  const [expanded, setExpanded] = useState(false);
  const visibleHints = expanded
    ? hints
    : hints.slice(0, TEMPLATES_PREVIEW_COUNT);

  function renderChips() {
    if (isLoading) {
      return (
        <div aria-busy="true" className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-7 w-28 rounded-full" />
          ))}
        </div>
      );
    }
    if (isError) {
      return (
        <p role="alert" className="text-sm text-muted-foreground">
          {t('templates-error')}{' '}
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold text-primary underline underline-offset-2"
          >
            {t('templates-retry')}
          </button>
        </p>
      );
    }
    if (!hints.length) {
      return (
        <p className="text-sm text-muted-foreground">{t('templates-empty')}</p>
      );
    }
    return (
      <ul className="flex flex-wrap gap-2">
        {visibleHints.map((hint) => {
          const id = String(hint.id);
          const isAdded = addedIds.includes(id);
          const isPreviewed = previewId === id;
          const Icon = isAdded ? Check : Plus;
          return (
            <li key={id}>
              <button
                type="button"
                disabled={isAdded || isAtLimit}
                aria-pressed={isAdded || isPreviewed}
                onClick={() => onSelect(id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
                  isAdded
                    ? 'border-primary bg-card text-primary'
                    : isPreviewed
                      ? 'border-secondary bg-secondary text-white'
                      : 'border-transparent bg-muted text-foreground hover:border-primary',
                )}
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {hint.hint}
              </button>
            </li>
          );
        })}
        {hints.length > TEMPLATES_PREVIEW_COUNT ? (
          <li>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className="rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground"
            >
              {t(expanded ? 'show-less' : 'show-more')}
            </button>
          </li>
        ) : null}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">{t('templates-helper')}</p>
      {renderChips()}
    </div>
  );
}
