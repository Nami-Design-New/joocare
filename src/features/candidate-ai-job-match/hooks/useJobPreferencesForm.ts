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
    defaultValues: {
      domainIds: preferences?.domainIds ?? EMPTY_JOB_PREFERENCES.domainIds,
      jobFunction: preferences?.jobFunction ?? EMPTY_JOB_PREFERENCES.jobFunction,
      jobTitleIds:
        preferences?.jobTitleIds ?? EMPTY_JOB_PREFERENCES.jobTitleIds,
      companyIds: preferences?.companyIds ?? EMPTY_JOB_PREFERENCES.companyIds,
      countryId: preferences?.countryId ?? EMPTY_JOB_PREFERENCES.countryId,
      seniorityLevelIds:
        preferences?.seniorityLevelIds ?? EMPTY_JOB_PREFERENCES.seniorityLevelIds,
      highMatchOnly:
        preferences?.highMatchOnly ?? EMPTY_JOB_PREFERENCES.highMatchOnly,
    },
  });
  const jobFunction = useWatch({ control: form.control, name: 'jobFunction' });

  const onSubmit = form.handleSubmit((values) =>
    onSave({
      ...values,
      jobTitleOptions: preferences?.jobTitleOptions ?? [],
      companyOptions: preferences?.companyOptions ?? [],
      countryOption: preferences?.countryOption ?? null,
    }),
  );

  return { form, jobFunction, onSubmit };
}
