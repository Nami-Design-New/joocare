'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { SCREENING_QUESTION_TEMPLATES, TEMPLATES_PREVIEW_COUNT } from '../../constants';

type QuestionTemplateChipsProps = {
  addedIds: string[];
  previewId: string | null;
  onSelect: (templateId: string) => void;
};

// Template chips with Show More / Show Less (Figma 10181:44166).
export default function QuestionTemplateChips({
  addedIds,
  previewId,
  onSelect,
}: QuestionTemplateChipsProps) {
  const t = useTranslations('companyPage.postJob.questions');
  const [expanded, setExpanded] = useState(false);
  const templates = expanded
    ? SCREENING_QUESTION_TEMPLATES
    : SCREENING_QUESTION_TEMPLATES.slice(0, TEMPLATES_PREVIEW_COUNT);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground text-xs">{t('templates-helper')}</p>
      <ul className="flex flex-wrap gap-2">
        {templates.map((template) => {
          const isAdded = addedIds.includes(template.id);
          const isPreviewed = previewId === template.id;
          const Icon = isAdded ? Check : Plus;
          return (
            <li key={template.id}>
              <button
                type="button"
                disabled={isAdded}
                aria-pressed={isPreviewed}
                onClick={() => onSelect(template.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
                  isAdded
                    ? 'border-primary bg-card text-primary'
                    : isPreviewed
                      ? 'border-secondary bg-secondary text-white'
                      : 'bg-muted text-foreground hover:border-primary border-transparent',
                )}
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {t(`template-labels.${template.labelKey}`)}
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-xs"
          >
            {t(expanded ? 'show-less' : 'show-more')}
          </button>
        </li>
      </ul>
    </div>
  );
}
