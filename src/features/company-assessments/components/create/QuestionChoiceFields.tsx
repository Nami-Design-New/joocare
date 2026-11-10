'use client';

import { Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { MultiSelectInputField } from '@/shared/components/MultiSelectInputField';
import { Button } from '@/shared/components/ui/button';
import { MAX_QUESTION_OPTIONS } from '../../constants/assessment-builder';
import type { useAssessmentQuestionForm } from '../../hooks/useAssessmentQuestionForm';

type QuestionChoiceFieldsProps = {
  questionForm: ReturnType<typeof useAssessmentQuestionForm>;
  portalContainer: HTMLElement | null;
};

export default function QuestionChoiceFields({
  questionForm,
  portalContainer,
}: QuestionChoiceFieldsProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const { form, type, options, removeOption } = questionForm;
  const answerOptions = options.fields.map((option, index) => ({
    value: option.id,
    label: String.fromCharCode(65 + index),
  }));
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">{t('answer-options')}</p>
        {options.fields.map((option, index) => (
          <div key={option.fieldKey} className="flex items-center gap-3">
            <span className="text-muted-foreground text-base">
              {String.fromCharCode(65 + index)}.
            </span>
            <InputField
              id={`question-option-${option.id}`}
              aria-label={t('option-label', {
                letter: String.fromCharCode(65 + index),
              })}
              placeholder={t('option-placeholder')}
              {...form.register(`options.${index}.text`)}
              className="h-11 bg-transparent shadow-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              disabled={options.fields.length <= 2}
              aria-label={t('remove-option', {
                letter: String.fromCharCode(65 + index),
              })}
              onClick={() => removeOption(index)}
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
        ))}
        {form.formState.errors.options && (
          <p role="alert" className="text-destructive text-sm">
            {t('validation.options')}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Button
            type="button"
            variant="link"
            className="h-auto gap-2 p-0"
            disabled={options.fields.length >= MAX_QUESTION_OPTIONS}
            onClick={() =>
              options.append({ id: crypto.randomUUID(), text: '' })
            }
          >
            <Plus className="size-4" />
            {t('add-option')}
          </Button>
          <span className="text-muted-foreground">
            {t('options-limit', { count: MAX_QUESTION_OPTIONS })}
          </span>
        </div>
      </div>
      <div className="border-border border-t pt-5">
        <Controller
          control={form.control}
          name="correctAnswers"
          render={({ field }) =>
            type === 'multiple-choice' ? (
              <MultiSelectInputField
                id="question-correct-answers"
                label={t('correct-answer')}
                options={answerOptions}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.correctAnswers?.message}
                placeholder={t('select-answers')}
                searchPlaceholder={t('select-answers')}
                portalContainer={portalContainer}
                className="bg-transparent shadow-none"
              />
            ) : (
              <SelectInputField
                id="question-correct-answer"
                label={t('correct-answer')}
                options={answerOptions}
                value={field.value[0] ?? ''}
                onChange={(value) => field.onChange(value ? [value] : [])}
                error={form.formState.errors.correctAnswers?.message}
                placeholder={t('select-answer')}
                portalContainer={portalContainer}
                className="bg-transparent shadow-none"
              />
            )
          }
        />
      </div>
    </div>
  );
}
