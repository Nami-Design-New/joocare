'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { useJobPreferencesForm } from '../../hooks/useJobPreferencesForm';
import type {
  JobPreferences,
  JobPreferencesMode,
} from '../../types/ai-job-match.types';
import HighMatchToggleField from './HighMatchToggleField';
import JobFunctionField from './JobFunctionField';
import JobTitlesField from './JobTitlesField';
import PreferredCompaniesField from './PreferredCompaniesField';
import PreferredCountriesField from './PreferredCountriesField';
import PreferredDomainsField from './PreferredDomainsField';
import SeniorityLevelsField from './SeniorityLevelsField';

type JobPreferencesFormProps = {
  mode: JobPreferencesMode;
  preferences: JobPreferences | null;
  portalContainer: HTMLElement | null;
  onSave: (values: JobPreferences) => void;
  isSaving: boolean;
};

export default function JobPreferencesForm({
  mode,
  preferences,
  portalContainer,
  onSave,
  isSaving,
}: JobPreferencesFormProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const { form, jobFunction, onSubmit } = useJobPreferencesForm({
    preferences,
    onSave,
  });
  const { control } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <PreferredDomainsField control={control} />
      <JobFunctionField control={control} />
      <JobTitlesField
        control={control}
        portalContainer={portalContainer}
        savedOptions={preferences?.jobTitleOptions ?? []}
      />
      <PreferredCompaniesField
        control={control}
        portalContainer={portalContainer}
        savedOptions={preferences?.companyOptions ?? []}
      />
      <PreferredCountriesField
        control={control}
        portalContainer={portalContainer}
        savedOption={preferences?.countryOption ?? null}
      />
      <SeniorityLevelsField
        control={control}
        jobFunction={jobFunction}
        portalContainer={portalContainer}
      />
      <HighMatchToggleField control={control} />
      <Button
        type="submit"
        size="pill"
        className="mx-auto h-12"
        disabled={form.formState.isSubmitting || isSaving}
      >
        {t(mode === 'add' ? 'save-and-find' : 'update-matches')}
      </Button>
    </form>
  );
}
