'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { EMPTY_JOB_PREFERENCES } from '../constants';
import type { JobPreferences } from '../types/ai-job-match.types';
import {
  jobPreferencesSchema,
  type TJobPreferencesSchema,
} from '../validation/job-preferences-schema';

type UseJobPreferencesFormOptions = {
  preferences: JobPreferences | null;
  onSave: (values: JobPreferences) => void;
};

export function useJobPreferencesForm({
  preferences,
  onSave,
}: UseJobPreferencesFormOptions) {
  const form = useForm<TJobPreferencesSchema>({
    resolver: zodResolver(jobPreferencesSchema),
    defaultValues: preferences ?? EMPTY_JOB_PREFERENCES,
  });
  const jobFunction = useWatch({ control: form.control, name: 'jobFunction' });

  const onSubmit = form.handleSubmit((values) => onSave(values));

  return { form, jobFunction, onSubmit };
}
