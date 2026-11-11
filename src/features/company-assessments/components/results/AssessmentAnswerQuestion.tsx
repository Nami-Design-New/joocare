'use client';

import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/components/ui/accordion';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import type { AssessmentAnswerQuestion as AnswerQuestion } from '../../types/assessment-answers.types';
import { getAnswerStatus } from '../../utils/assessment-answers';

type AssessmentAnswerQuestionProps = { question: AnswerQuestion };

export default function AssessmentAnswerQuestion({
  question,
}: AssessmentAnswerQuestionProps) {
  const t = useTranslations('companyPage.assessments.answers');
  const format = useFormatter();
  const status = getAnswerStatus(question);

  return (
    <AccordionItem
      value={question.id}
      className="rounded-lg border-0 bg-card p-6"
    >
      <AccordionTrigger
        iconType="arrow"
        className="items-start gap-2 p-0 text-start hover:no-underline [&>svg]:text-assessment-muted"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-4">
          <span className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-assessment-primary/8 px-2.5 py-1 text-xs font-bold text-assessment-primary">
              {t('question-number', { number: question.number })}
            </span>
            <span
              className={cn('rounded px-2.5 py-1 text-xs font-semibold', {
                'bg-assessment-primary/8 text-assessment-primary':
                  status === 'correct',
                'bg-assessment-error/10 text-assessment-error':
                  status === 'wrong',
                'bg-assessment-missing/10 text-assessment-missing':
                  status === 'missing',
              })}
            >
              {t(status)}
            </span>
            {question.image ? (
              <span className="rounded bg-secondary/5 px-2.5 py-1 text-xs font-semibold text-assessment-dark">
                {t('includes-image')}
              </span>
            ) : null}
            <span
              className={cn('ms-auto text-sm font-semibold', {
                'text-assessment-primary': status === 'correct',
                'text-assessment-error': status === 'wrong',
                'text-assessment-missing': status === 'missing',
              })}
            >
              {format.number(question.points)} /{' '}
              {format.number(question.maxPoints)}
            </span>
          </span>
          <span className="text-[15px] leading-5 font-medium text-assessment-dark">
            {question.text}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4 pb-0">
        {question.image ? (
          <Image
            src={question.image.src}
            width={question.image.width}
            height={question.image.height}
            alt={question.image.description}
            className="h-auto max-w-full rounded-lg"
          />
        ) : null}
        <ul className="space-y-2">
          {question.options.map((option, index) => {
            const selected = question.selectedOptionIds.includes(option.id);
            const correct = question.correctOptionIds.includes(option.id);
            return (
              <li
                key={option.id}
                className={cn(
                  'flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 rounded-sm border border-assessment-border px-4 py-3 text-sm leading-4.5',
                  {
                    'border-assessment-primary/35 bg-assessment-primary/8 text-assessment-primary':
                      correct,
                    'border-assessment-error/35 bg-assessment-error/8 text-assessment-error':
                      selected && !correct,
                    'text-assessment-dark': !correct && !selected,
                  },
                )}
              >
                <span aria-hidden="true" className="flex items-center gap-3">
                  {question.multiple ? (
                    <Checkbox
                      checked={selected}
                      disabled
                      tabIndex={-1}
                      className="size-4 h-4 w-4 rounded-xs border-assessment-outline shadow-none disabled:opacity-100 data-[state=checked]:border-assessment-primary data-[state=checked]:bg-assessment-primary"
                    />
                  ) : (
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full border border-assessment-outline',
                        selected &&
                          (correct
                            ? 'border-assessment-primary'
                            : 'border-assessment-error'),
                      )}
                    >
                      {selected ? (
                        <span className="size-2 rounded-full bg-current" />
                      ) : null}
                    </span>
                  )}
                  <span className="text-assessment-muted">
                    {String.fromCharCode(65 + index)}.
                  </span>
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 basis-40',
                    correct && 'font-medium',
                  )}
                >
                  {option.text}
                </span>
                <span className="ms-auto flex flex-wrap gap-2 text-[11px] leading-3.5 font-semibold">
                  {selected ? (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5',
                        correct
                          ? 'bg-assessment-primary/15'
                          : 'bg-assessment-error/15',
                      )}
                    >
                      {t('candidate-answer')}
                    </span>
                  ) : null}
                  {correct ? (
                    <span className="rounded-full bg-assessment-primary/15 px-2 py-0.5">
                      {t('correct-answer')}
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
        {status === 'missing' ? (
          <p className="rounded-lg bg-assessment-missing/8 px-3 py-2.5 text-[13px] leading-4 font-medium text-assessment-missing">
            {t(question.optional ? 'skipped-optional' : 'skipped-question', {
              points: question.maxPoints,
            })}
          </p>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
