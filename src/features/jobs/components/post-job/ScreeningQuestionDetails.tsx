'use client';

import { useTranslations } from 'next-intl';
import type { ScreeningQuestion } from '../../types/job-steps.types';
import { getOptionLetter } from '../../utils';

type ScreeningQuestionDetailsProps = {
  question: ScreeningQuestion;
};

// Read-only question summary, shared by the "Screening Questions (N)" modal
// (JobScreeningQuestionsModal) and the custom-question card's preview.
export default function ScreeningQuestionDetails({
  question,
}: ScreeningQuestionDetailsProps) {
  const t = useTranslations('companyPage.jobs.attachments');
  const answer = question.options
    .filter((option) => question.correctOptionIds.includes(option.id))
    .map((option) => option.text)
    .join(', ');

  return (
    <dl className="bg-muted flex flex-col gap-3 rounded-xl p-4 text-sm">
      <div className="flex gap-2">
        <dt className="font-semibold">{t('type-label')}:</dt>
        <dd>{t(`types.${question.type}`)}</dd>
      </div>
      {question.type === 'single' || question.type === 'multi' ? (
        <div className="flex flex-col gap-2">
          <dt className="font-semibold">{t('options-label')}</dt>
          {question.options.map((option, index) => (
            <dd key={option.id} className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                {getOptionLetter(index)}.
              </span>
              {option.text}
            </dd>
          ))}
        </div>
      ) : null}
      {answer ? (
        <div className="flex gap-2">
          <dt className="font-semibold">{t('correct-answer')}:</dt>
          <dd>{answer}</dd>
        </div>
      ) : null}
    </dl>
  );
}
