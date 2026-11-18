'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';
import type { AdditionalInfoValues } from '../types/additional-info.types';
import { getProfileCompletion } from '../utils/profile-completion';
import { toAdditionalInfoForm } from '../utils/profile-details-mapper';
import { toProfileDetailsFormData } from '../utils/profile-details-payload';
import { createAdditionalInfoSchema } from '../validation/additional-info-schema';
import useSaveProfileDetails from './useSaveProfileDetails';

// Form state of the Additional Information tab. `savedValues` are the profile
// details last loaded or saved; they drive the completion card and Cancel.
export function useAdditionalInfoForm(savedValues: AdditionalInfoValues) {
  const t = useTranslations('candidatePage.additional-info');
  const schema = useMemo(
    () =>
      createAdditionalInfoSchema({
        invalidAmount: t('errors.invalid-amount'),
        salaryRange: t('errors.salary-range'),
        otherRequired: t('errors.other-required'),
      }),
    [t],
  );
  const form = useForm<AdditionalInfoValues>({
    resolver: typedZodResolver(schema),
    defaultValues: savedValues,
  });
  const completion = useMemo(
    () => getProfileCompletion(savedValues),
    [savedValues],
  );
  const save = useSaveProfileDetails();

  const onSubmit = form.handleSubmit((values) => {
    save.mutate(toProfileDetailsFormData(values), {
      onSuccess: (details) => {
        form.reset(toAdditionalInfoForm(details));
        toast.success(t('saved'));
      },
      onError: (error) => {
        toast.error(error.message || t('errors.save-failed'));
      },
    });
  });

  return {
    form,
    completion,
    isSaving: save.isPending,
    onSubmit,
    onCancel: () => form.reset(savedValues),
  };
}
