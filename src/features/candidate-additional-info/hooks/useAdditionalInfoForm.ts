'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';
import { ADDITIONAL_INFO_PREVIEW } from '../constants/additional-info-preview-data';
import type { AdditionalInfoValues } from '../types/additional-info.types';
import { getProfileCompletion } from '../utils/profile-completion';
import { createAdditionalInfoSchema } from '../validation/additional-info-schema';

// Form state of the Additional Information tab. Saved values stay local until the API is ready.
export function useAdditionalInfoForm(
  initialValues: AdditionalInfoValues = ADDITIONAL_INFO_PREVIEW,
) {
  const t = useTranslations('candidatePage.additional-info');
  const schema = useMemo(
    () =>
      createAdditionalInfoSchema({
        invalidAmount: t('errors.invalid-amount'),
        salaryRange: t('errors.salary-range'),
      }),
    [t],
  );
  const [saved, setSaved] = useState(initialValues);
  const form = useForm<AdditionalInfoValues>({
    resolver: typedZodResolver(schema),
    defaultValues: saved,
  });
  const completion = useMemo(() => getProfileCompletion(saved), [saved]);

  const onSubmit = form.handleSubmit((values) => {
    setSaved(values);
    form.reset(values);
    toast.success(t('saved'));
  });

  return {
    form,
    completion,
    onSubmit,
    onCancel: () => form.reset(saved),
  };
}
