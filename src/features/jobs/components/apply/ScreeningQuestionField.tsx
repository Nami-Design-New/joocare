'use client';

import { useTranslations } from 'next-intl';
import { type Control, Controller } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import ChoiceOptionCard from '@/shared/components/questions/ChoiceOptionCard';
import QuestionHeading from '@/shared/components/questions/QuestionHeading';
import { cn } from '@/shared/lib/utils';
import type {
  ApplyScreeningQuestion,
  ScreeningAnswersFormValues,
} from '../../types/job-apply.types';

type ScreeningQuestionFieldProps = {
  question: ApplyScreeningQuestion;
  index: number;
  control: Control<ScreeningAnswersFormValues>;
};

// One employer question: yes / no, single choice, multiple choice or short answer.
export default function ScreeningQuestionField({
  question,
  index,
  control,
}: ScreeningQuestionFieldProps) {
  const t = useTranslations('jobDetailsPage.apply.questions');
  const headingId = `screening-question-${question.id}`;
  const errorId = `${headingId}-error`;
  const heading = (
    <QuestionHeading
      id={headingId}
      badge={String(index + 1)}
      title={question.question}
      note={question.required ? undefined : t('optional')}
    />
  );

  if (question.type === 'text') {
    return (
      <Controller
        control={control}
        name={`answers.${index}.text`}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-3">
            {heading}
            <InputField
              {...field}
              id={`${headingId}-input`}
              aria-labelledby={headingId}
              placeholder={question.placeholder ?? t('text-placeholder')}
              error={fieldState.error?.message}
            />
          </div>
        )}
      />
    );
  }

  const isMulti = question.type === 'multi';

  return (
    <Controller
      control={control}
      name={`answers.${index}.selected`}
      render={({ field, fieldState }) => {
        const toggle = (optionId: string, checked: boolean) => {
          if (!isMulti) return field.onChange([optionId]);
          field.onChange(
            checked
              ? [...field.value, optionId]
              : field.value.filter((id) => id !== optionId),
          );
        };

        return (
          <fieldset
            aria-labelledby={headingId}
            aria-describedby={fieldState.error ? errorId : undefined}
            className="flex flex-col gap-3"
          >
            {heading}
            <div
              className={cn(
                'grid gap-3',
                question.type === 'yes-no' && 'sm:grid-cols-2',
              )}
            >
              {question.options.map((option, optionIndex) => (
                <ChoiceOptionCard
                  key={option.id}
                  type={isMulti ? 'checkbox' : 'radio'}
                  name={`${headingId}-option`}
                  value={option.id}
                  checked={field.value.includes(option.id)}
                  onChange={(checked) => toggle(option.id, checked)}
                  label={<bdi>{option.text}</bdi>}
                  invalid={Boolean(fieldState.error)}
                  inputRef={optionIndex === 0 ? field.ref : undefined}
                />
              ))}
            </div>
            {fieldState.error ? (
              <p id={errorId} role="alert" className="text-destructive text-sm">
                {fieldState.error.message}
              </p>
            ) : null}
          </fieldset>
        );
      }}
    />
  );
}
