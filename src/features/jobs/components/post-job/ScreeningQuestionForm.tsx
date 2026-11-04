'use client';

import { useMemo } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  SCREENING_OPTION_LIMITS,
  SCREENING_QUESTION_TYPES,
  YES_NO_OPTION_IDS,
} from '../../constants';
import type { ScreeningQuestion } from '../../types/job-steps.types';
import { getOptionLetter } from '../../utils';
import {
  createScreeningQuestionSchema,
  type TScreeningQuestionSchema,
} from '../../validation/screening-question-schema';
import QuestionRequirementField from './QuestionRequirementField';
import SegmentedPills from './SegmentedPills';

type ScreeningQuestionFormProps = {
  idPrefix: string;
  question?: ScreeningQuestion | null;
  onSubmit: (question: ScreeningQuestion) => void;
  // "create": full-width Submit (modal). "edit": Cancel / Save Changes (inline card).
  variant: 'create' | 'edit';
  onCancel?: () => void;
};

const newOption = () => ({ id: crypto.randomUUID(), text: '' });

function toFormValues(question?: ScreeningQuestion | null): TScreeningQuestionSchema {
  const isChoice = question?.type === 'single' || question?.type === 'multi';
  return {
    type: question?.type ?? 'single',
    mark: question ? String(question.mark) : '',
    question: question?.question ?? '',
    options: isChoice
      ? question.options
      : Array.from({ length: SCREENING_OPTION_LIMITS.initial }, newOption),
    correctOptionIds: question?.correctOptionIds ?? [],
    correctText: question?.correctText ?? '',
    required: question?.required ?? true,
  };
}

// Create / edit a screening question (Figma section 12795:112132).
export default function ScreeningQuestionForm({
  idPrefix,
  question,
  onSubmit,
  variant,
  onCancel,
}: ScreeningQuestionFormProps) {
  const t = useTranslations('companyPage.postJob.questions.builder');
  const schema = useMemo(
    () =>
      createScreeningQuestionSchema({
        questionRequired: t('question-required'),
        markPositive: t('mark-positive'),
        optionRequired: t('option-required'),
        optionDuplicate: t('option-duplicate'),
        chooseExactlyOne: t('choose-exactly-one'),
        chooseAtLeastOne: t('choose-at-least-one'),
        answerRequired: t('answer-required'),
      }),
    [t],
  );
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<TScreeningQuestionSchema>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(question),
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'options' });
  const type = useWatch({ control, name: 'type' });
  const correctOptionIds = useWatch({ control, name: 'correctOptionIds' });
  const required = useWatch({ control, name: 'required' });
  const isChoice = type === 'single' || type === 'multi';

  const changeType = (next: TScreeningQuestionSchema['type']) => {
    // Keep what still fits the new type (handoff rule).
    const current = getValues('correctOptionIds');
    const optionIds = getValues('options').map((option) => option.id);
    const kept =
      next === 'yes-no'
        ? current.filter((id) => YES_NO_OPTION_IDS.includes(id))
        : current.filter((id) => optionIds.includes(id));
    setValue('correctOptionIds', next === 'single' || next === 'yes-no' ? kept.slice(0, 1) : kept);
    setValue('type', next);
  };

  const toggleCorrect = (id: string) => {
    const current = getValues('correctOptionIds');
    const next =
      type === 'single'
        ? [id]
        : current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];
    setValue('correctOptionIds', next, { shouldValidate: isSubmitted });
  };

  const removeOption = (index: number, id: string) => {
    remove(index);
    setValue(
      'correctOptionIds',
      getValues('correctOptionIds').filter((item) => item !== id),
      { shouldValidate: isSubmitted },
    );
  };

  const submit = handleSubmit((values) => {
    onSubmit({
      id: question?.id ?? crypto.randomUUID(),
      source: question?.source ?? 'custom',
      templateId: question?.templateId,
      type: values.type,
      mark: Number(values.mark),
      question: values.question.trim(),
      options:
        values.type === 'yes-no'
          ? YES_NO_OPTION_IDS.map((id) => ({ id, text: t(id) }))
          : values.type === 'text'
            ? []
            : values.options.map((option) => ({ ...option, text: option.text.trim() })),
      correctOptionIds: values.type === 'text' ? [] : values.correctOptionIds,
      correctText: values.type === 'text' ? values.correctText.trim() : undefined,
      required: values.type === 'text' ? false : values.required,
    });
  });

  const answerError = errors.correctOptionIds?.message ?? errors.correctText?.message;
  const hasOtherErrors = Boolean(
    errors.question || errors.mark || errors.options,
  );
  const summary = hasOtherErrors
    ? t(type === 'single' ? 'invalid-single' : type === 'multi' ? 'invalid-multi' : 'invalid-question')
    : answerError;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectInputField
          id={`${idPrefix}-type`}
          aria-label={t('question-type')}
          value={type}
          options={SCREENING_QUESTION_TYPES.map((value) => ({ value, label: t(value) }))}
          onChange={(value) => changeType(value as TScreeningQuestionSchema['type'])}
          className="bg-card"
        />
        <InputField
          id={`${idPrefix}-mark`}
          type="number"
          min={1}
          inputMode="numeric"
          aria-label={t('mark')}
          placeholder={t('mark')}
          error={errors.mark?.message}
          className="bg-card"
          {...register('mark')}
        />
      </div>
      <InputField
        id={`${idPrefix}-question`}
        aria-label={t('question-label')}
        placeholder={t('question-placeholder')}
        error={errors.question?.message}
        className="bg-card"
        {...register('question')}
      />

      {isChoice ? (
        <>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-foreground mb-3 text-xs font-semibold">{t('answer-options')}</legend>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3">
                <span className="text-muted-foreground mt-3.5 w-6 text-lg">{getOptionLetter(index)}.</span>
                <InputField
                  id={`${idPrefix}-option-${field.id}`}
                  aria-label={t('option-label', { letter: getOptionLetter(index) })}
                  placeholder={t('option-placeholder')}
                  error={errors.options?.[index]?.text?.message}
                  className="bg-card h-11"
                  containerStyles="flex-1"
                  {...register(`options.${index}.text`)}
                />
                <button
                  type="button"
                  aria-label={t('remove-option', { letter: getOptionLetter(index) })}
                  disabled={fields.length <= SCREENING_OPTION_LIMITS.min}
                  onClick={() => removeOption(index, field.id)}
                  className="text-destructive mt-2.5 rounded-full p-1 disabled:opacity-40"
                >
                  <Trash2 aria-hidden="true" className="size-5" />
                </button>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={fields.length >= SCREENING_OPTION_LIMITS.max}
                onClick={() => append(newOption())}
                className="text-primary flex items-center gap-1.5 text-sm font-semibold disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="size-4" />
                {t('add-option')}
              </button>
              <span className="text-muted-foreground text-xs" aria-live="polite">
                {t('options-counter', { count: fields.length })}
              </span>
            </div>
          </fieldset>
          <fieldset className="border-border flex flex-col gap-3 border-t pt-5">
            <legend className="sr-only">{t(type === 'single' ? 'correct-one' : 'correct-many')}</legend>
            <p aria-hidden="true" className="text-foreground font-semibold">
              {t(type === 'single' ? 'correct-one' : 'correct-many')}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {fields.map((field, index) => {
                const checked = correctOptionIds.includes(field.id);
                return (
                  <label
                    key={field.id}
                    className={cn(
                      'border-border flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full border text-sm font-semibold has-focus-visible:ring-2 has-focus-visible:ring-ring',
                      checked && 'border-primary',
                    )}
                  >
                    <input
                      type={type === 'single' ? 'radio' : 'checkbox'}
                      name={`${idPrefix}-correct`}
                      checked={checked}
                      onChange={() => toggleCorrect(field.id)}
                      className="accent-primary size-4.5"
                    />
                    {getOptionLetter(index)}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </>
      ) : null}

      {type === 'yes-no' ? (
        <div className="flex flex-col gap-3">
          <p className="text-foreground font-semibold">{t('correct-answer')}</p>
          <SegmentedPills
            name={`${idPrefix}-yes-no`}
            label={t('correct-answer')}
            value={correctOptionIds[0]}
            onChange={(value) => setValue('correctOptionIds', [value], { shouldValidate: isSubmitted })}
            options={YES_NO_OPTION_IDS.map((id) => ({ value: id, label: t(id) }))}
          />
        </div>
      ) : null}

      {type === 'text' ? (
        <InputField
          id={`${idPrefix}-answer`}
          label={t('correct-answer')}
          placeholder={t('answer-placeholder')}
          error={errors.correctText?.message}
          className="bg-card"
          {...register('correctText')}
        />
      ) : (
        <Controller
          control={control}
          name="required"
          render={({ field }) => (
            <QuestionRequirementField
              name={`${idPrefix}-required`}
              required={required}
              onChange={field.onChange}
            />
          )}
        />
      )}

      {isSubmitted && summary ? (
        <p role="alert" className="text-destructive text-center text-sm">
          {summary}
        </p>
      ) : null}

      {variant === 'create' ? (
        <Button type="submit" size="pill" className="w-full">
          {t('submit')}
        </Button>
      ) : (
        <div className="border-border flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" size="sm" className="rounded-full px-5" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="secondary" size="sm" className="rounded-full px-5">
            {t('save-changes')}
          </Button>
        </div>
      )}
    </form>
  );
}
