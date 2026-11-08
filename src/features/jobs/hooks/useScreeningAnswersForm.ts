import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type {
  ApplyScreeningQuestion,
  ScreeningAnswersFormValues,
} from '../types/job-apply.types';
import { createScreeningAnswersSchema } from '../validation/screening-answers-schema';

// Step 1 of applying: one answer per employer screening question.
export function useScreeningAnswersForm(questions: ApplyScreeningQuestion[]) {
  const t = useTranslations('jobDetailsPage.apply.questions');
  const schema = useMemo(
    () =>
      createScreeningAnswersSchema(questions, {
        required: t('required-error'),
      }),
    [questions, t],
  );

  return useForm<ScreeningAnswersFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      answers: questions.map((question) => ({
        questionId: question.id,
        selected: [],
        text: '',
      })),
    },
    reValidateMode: 'onChange',
  });
}
