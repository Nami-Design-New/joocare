'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type { ScreeningQuestion } from '../../types/job-steps.types';
import { getOptionLetter } from '../../utils';

type ScreeningQuestionPreviewProps = {
  question: ScreeningQuestion;
};

// Read-only preview for the expanded custom-question card (Figma
// 11073:44433) — the same pill-field visual language as the create/edit
// form itself, and the assessment builder's QuestionPreview.
export default function ScreeningQuestionPreview({
  question,
}: ScreeningQuestionPreviewProps) {
  const t = useTranslations('companyPage.postJob.questions.builder');
  const isYesNo = question.type === 'yes-no';
  const correctLetters = question.options
    .flatMap((option, index) =>
      question.correctOptionIds.includes(option.id)
        ? [getOptionLetter(index)]
        : [],
    )
    .join(', ');

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="border-border rounded-full border px-4 py-3">
          {t(question.type)}
        </div>
        <div
          className={cn(
            'rounded-full border px-4 py-3 text-center',
            question.required
              ? 'border-primary text-primary'
              : 'border-border text-muted-foreground',
          )}
        >
          {t(question.required ? 'required' : 'optional')}
        </div>
      </div>
      <p className="border-border rounded-3xl border px-4 py-3 text-sm">
        {question.question}
      </p>
      {isYesNo ? (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option) => (
            <span
              key={option.id}
              className={cn(
                'rounded-full px-4 py-3 text-center text-sm',
                question.correctOptionIds.includes(option.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {option.text}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-foreground/80 text-[13px] font-semibold">
            {t('answer-options')}
          </p>
          {question.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {getOptionLetter(index)}.
              </span>
              <span
                className={cn(
                  'border-border flex-1 rounded-full border px-4 py-2',
                  question.correctOptionIds.includes(option.id) &&
                    'bg-primary-bg text-primary border-primary',
                )}
              >
                {option.text}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="border-border flex flex-col gap-2 border-t pt-4">
        <p className="text-foreground text-sm font-semibold">
          {t('correct-answer')}
        </p>
        <p className="border-border rounded-full border px-4 py-3 text-sm">
          {isYesNo
            ? question.options.find((option) =>
                question.correctOptionIds.includes(option.id),
              )?.text
            : correctLetters}
        </p>
      </div>
    </div>
  );
}
