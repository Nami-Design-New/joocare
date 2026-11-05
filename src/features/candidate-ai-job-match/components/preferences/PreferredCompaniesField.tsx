'use client';

import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';
import { PREFERRED_COMPANY_OPTIONS } from '../../constants/ai-job-match-preview-data';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import PreferenceMultiSelectField from './PreferenceMultiSelectField';

type PreferredCompaniesFieldProps = {
  control: Control<TJobPreferencesSchema>;
  portalContainer: HTMLElement | null;
};

export default function PreferredCompaniesField({
  control,
  portalContainer,
}: PreferredCompaniesFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');

  return (
    <PreferenceMultiSelectField
      control={control}
      name="companyIds"
      label={t('preferred-companies')}
      placeholder={t('companies-placeholder')}
      options={PREFERRED_COMPANY_OPTIONS}
      portalContainer={portalContainer}
      withInitial
    />
  );
}
