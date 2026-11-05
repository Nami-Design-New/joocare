'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';
import type { CandidateExperienceViewModel } from '../types/profile.types';
import { toExperienceFormState } from '../utils/experience-form';
import {
  createExperienceModalSchema,
  type ExperienceModalFormData,
} from '../validation/experience-modal-schema';
import { useSaveExperience } from './useSaveExperience';

type UseExperienceFormOptions = {
  experience?: CandidateExperienceViewModel | null;
  onSaved: () => void;
};

export function useExperienceForm({
  experience,
  onSaved,
}: UseExperienceFormOptions) {
  const t = useTranslations();
  const schema = useMemo(
    () =>
      createExperienceModalSchema({
        jobTitleRequired: t('authPage.validation.job-title-required'),
        organizationMin: t('candidateValidation.organization-min'),
        organizationMax: t('candidateValidation.organization-max'),
        startDateRequired: t('candidateValidation.start-date-required'),
        responsibilityMin: t('candidateValidation.responsibility-min'),
        responsibilityMax: t('candidateValidation.responsibility-max'),
        responsibilitiesMin: t('candidateValidation.responsibilities-min'),
        otherJobTitleRequired: t(
          'authPage.validation.other-job-title-required',
        ),
        startDatePast: t('candidateValidation.start-date-past'),
        endDateRequired: t('candidateValidation.end-date-required'),
        endDateAfterStart: t('candidateValidation.end-date-after-start'),
      }),
    [t],
  );
  const form = useForm<ExperienceModalFormData>({
    resolver: typedZodResolver(schema),
    defaultValues: toExperienceFormState(experience),
  });
  const { mutate: saveExperience, isPending: isSaving } = useSaveExperience(
    experience?.id,
  );

  const onSubmit = form.handleSubmit((values) => {
    saveExperience(values, { onSuccess: onSaved });
  });

  const clearEndDateWhenCurrent = (workHere: boolean) => {
    if (workHere) {
      form.setValue('endDate', '');
    }
  };

  return { form, onSubmit, isSaving, clearEndDateWhenCurrent };
}
