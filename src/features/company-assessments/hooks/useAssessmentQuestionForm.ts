'use client';

import { useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createQuestionDefaults } from '../constants/assessment-builder';
import { createAssessmentQuestionSchema } from '../validation/assessment-builder-schema';
import type {
  BuilderQuestion,
  QuestionFormValues,
} from '../types/assessment-builder.types';

export function useAssessmentQuestionForm(question: BuilderQuestion | null) {
  const t = useTranslations('companyPage.assessments.builder');
  const schema = useMemo(
    () =>
      createAssessmentQuestionSchema({
        required: t('validation.required'),
        percentage: t('validation.percentage'),
        duration: t('validation.duration'),
        options: t('validation.options'),
        answer: t('validation.answer'),
        attachment: t('validation.attachment'),
      }),
    [t],
  );
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: question ?? createQuestionDefaults(),
  });
  const options = useFieldArray({
    control: form.control,
    name: 'options',
    keyName: 'fieldKey',
  });
  const type = useWatch({ control: form.control, name: 'type' });
  const attachmentEnabled = useWatch({
    control: form.control,
    name: 'attachmentEnabled',
  });
  const attachment = useWatch({ control: form.control, name: 'attachment' });
  const answers = useWatch({ control: form.control, name: 'correctAnswers' });

  function changeType(value: string) {
    if (
      value !== 'yes-no' &&
      value !== 'single-choice' &&
      value !== 'multiple-choice'
    )
      return;
    form.setValue('type', value, { shouldDirty: true });
    form.setValue('correctAnswers', value === 'yes-no' ? ['yes'] : [], {
      shouldDirty: true,
    });
    form.clearErrors(['correctAnswers', 'options']);
  }

  function removeOption(index: number) {
    const id = form.getValues(`options.${index}.id`);
    options.remove(index);
    form.setValue(
      'correctAnswers',
      form.getValues('correctAnswers').filter((answer) => answer !== id),
      { shouldDirty: true },
    );
  }

  return {
    form,
    options,
    type,
    attachmentEnabled,
    attachment,
    answers,
    changeType,
    removeOption,
  };
}
