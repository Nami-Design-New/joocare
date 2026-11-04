'use client';

import { useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { SCREENING_OPTION_LIMITS, YES_NO_OPTION_IDS } from '../constants';
import type { ScreeningQuestion } from '../types/job-steps.types';
import {
  createScreeningQuestionSchema,
  type TScreeningQuestionSchema,
} from '../validation/screening-question-schema';

const newOption = () => ({ id: crypto.randomUUID(), text: '' });

function toFormValues(
  question?: ScreeningQuestion | null,
): TScreeningQuestionSchema {
  return {
    type: question?.type ?? 'single',
    question: question?.question ?? '',
    options:
      question && question.type !== 'yes-no'
        ? question.options
        : Array.from({ length: SCREENING_OPTION_LIMITS.initial }, newOption),
    correctOptionIds: question?.correctOptionIds ?? [],
    required: question?.required ?? true,
  };
}

// Same structure as useAssessmentQuestionForm, with the screening question rules.
export function useScreeningQuestionForm(
  question: ScreeningQuestion | null | undefined,
  onSubmit: (question: ScreeningQuestion) => void,
) {
  const t = useTranslations('companyPage.postJob.questions.builder');
  const schema = useMemo(
    () =>
      createScreeningQuestionSchema({
        questionRequired: t('question-required'),
        optionRequired: t('option-required'),
        optionDuplicate: t('option-duplicate'),
        chooseExactlyOne: t('choose-exactly-one'),
        chooseAtLeastOne: t('choose-at-least-one'),
      }),
    [t],
  );
  const form = useForm<TScreeningQuestionSchema>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(question),
  });
  const options = useFieldArray({
    control: form.control,
    name: 'options',
    keyName: 'fieldKey',
  });
  const type = useWatch({ control: form.control, name: 'type' });
  const correctOptionIds = useWatch({
    control: form.control,
    name: 'correctOptionIds',
  });
  const required = useWatch({ control: form.control, name: 'required' });
  const validateAnswers = { shouldValidate: form.formState.isSubmitted };

  function changeType(value: string) {
    const next = value as TScreeningQuestionSchema['type'];
    if (!next || next === type) return;
    // Keep the correct answers that still fit the new type (handoff rule).
    const optionIds = form.getValues('options').map((option) => option.id);
    const kept = form
      .getValues('correctOptionIds')
      .filter((id) =>
        next === 'yes-no'
          ? YES_NO_OPTION_IDS.includes(id)
          : optionIds.includes(id),
      );
    form.setValue('type', next, { shouldDirty: true });
    form.setValue(
      'correctOptionIds',
      next === 'multi' ? kept : kept.slice(0, 1),
      { shouldDirty: true },
    );
    form.clearErrors(['correctOptionIds', 'options']);
  }

  function toggleCorrect(id: string) {
    const current = form.getValues('correctOptionIds');
    const next =
      type === 'multi'
        ? current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id]
        : [id];
    form.setValue('correctOptionIds', next, validateAnswers);
  }

  function setCorrectOptionIds(ids: string[]) {
    form.setValue('correctOptionIds', ids, validateAnswers);
  }

  function addOption() {
    options.append(newOption());
  }

  function removeOption(index: number) {
    const id = form.getValues(`options.${index}.id`);
    options.remove(index);
    form.setValue(
      'correctOptionIds',
      form.getValues('correctOptionIds').filter((answer) => answer !== id),
      validateAnswers,
    );
  }

  const submit = form.handleSubmit((values) =>
    onSubmit({
      id: question?.id ?? crypto.randomUUID(),
      source: question?.source ?? 'custom',
      templateId: question?.templateId,
      type: values.type,
      // Mark has no field in the design; keep the existing one, new questions get 1.
      mark: question?.mark ?? 1,
      question: values.question.trim(),
      options:
        values.type === 'yes-no'
          ? YES_NO_OPTION_IDS.map((id) => ({ id, text: t(id) }))
          : values.options.map((option) => ({
              ...option,
              text: option.text.trim(),
            })),
      correctOptionIds: values.correctOptionIds,
      required: values.required,
    }),
  );

  return {
    form,
    options,
    type,
    correctOptionIds,
    required,
    changeType,
    toggleCorrect,
    setCorrectOptionIds,
    addOption,
    removeOption,
    submit,
  };
}

export type ScreeningQuestionFormState = ReturnType<
  typeof useScreeningQuestionForm
>;
