'use client';

import { FormProvider } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { useAdditionalInfoForm } from '../hooks/useAdditionalInfoForm';
import ProfileCompletionCard from './ProfileCompletionCard';
import CareerPreferencesSection from './sections/CareerPreferencesSection';
import LanguagesSection from './sections/LanguagesSection';
import MobilitySection from './sections/MobilitySection';
import PersonalDetailsSection from './sections/PersonalDetailsSection';
import ProfessionalInfoSection from './sections/ProfessionalInfoSection';
import QualificationsSection from './sections/QualificationsSection';
import SalarySection from './sections/SalarySection';

// Profile "Additional Information" tab: completion summary and the editable form.
export default function AdditionalInfoPage() {
  const t = useTranslations('candidatePage.additional-info');
  const { form, completion, onSubmit, onCancel } = useAdditionalInfoForm();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl leading-8 font-semibold sm:text-[32px] sm:leading-10">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </header>

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
              className="h-12.5 w-full border-secondary text-sm font-semibold text-secondary sm:w-auto sm:min-w-40"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="pill"
              className="h-12.5 w-full text-sm font-semibold sm:w-auto sm:min-w-56"
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
