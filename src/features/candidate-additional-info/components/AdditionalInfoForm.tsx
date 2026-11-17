'use client';

import { FormProvider } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { useAdditionalInfoForm } from '../hooks/useAdditionalInfoForm';
import type { AdditionalInfoValues } from '../types/additional-info.types';
import ProfileCompletionCard from './ProfileCompletionCard';
import CareerPreferencesSection from './sections/CareerPreferencesSection';
import LanguagesSection from './sections/LanguagesSection';
import MobilitySection from './sections/MobilitySection';
import PersonalDetailsSection from './sections/PersonalDetailsSection';
import ProfessionalInfoSection from './sections/ProfessionalInfoSection';
import QualificationsSection from './sections/QualificationsSection';
import SalarySection from './sections/SalarySection';

type AdditionalInfoFormProps = {
  initialValues: AdditionalInfoValues;
};

// Completion summary and the editable form, filled with the saved profile details.
export default function AdditionalInfoForm({
  initialValues,
}: AdditionalInfoFormProps) {
  const t = useTranslations('candidatePage.additional-info');
  const { form, completion, isSaving, onSubmit, onCancel } =
    useAdditionalInfoForm(initialValues);

  return (
    <>
      <ProfileCompletionCard
        percent={completion.percent}
        items={completion.items}
      />

      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={onSubmit}
          className="flex flex-col gap-6 rounded-2xl bg-card px-4 pt-7.5 pb-6 md:px-10"
        >
          <QualificationsSection />
          <LanguagesSection />
          <MobilitySection />
          <CareerPreferencesSection />
          <ProfessionalInfoSection />
          <PersonalDetailsSection />
          <SalarySection />

          <div className="flex flex-wrap justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size="pill"
              onClick={onCancel}
              disabled={isSaving}
              className="h-12.5 w-full border-secondary text-sm font-semibold text-secondary sm:w-auto sm:min-w-40"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              variant="secondary"
              size="pill"
              className="h-12.5 w-full text-sm font-semibold sm:w-auto sm:min-w-56"
            >
              {t(isSaving ? 'saving' : 'save')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
