'use client';

import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  availabilityFields,
  careerFields,
  employmentFields,
  experienceFields,
  languageFields,
  licensingFields,
  occupationalFields,
  personalFields,
} from '../constants/talent-filters';
import type { TalentFilterValues } from '../types/talent-database.types';
import { createTalentSearchSchema } from '../validation/talent-search-schema';
import TalentFilterFields from './TalentFilterFields';
import TalentFilterSection from './TalentFilterSection';
import TalentMobilityFilters from './TalentMobilityFilters';
import TalentSalaryFilters from './TalentSalaryFilters';
import TalentKeywordFilter from './TalentKeywordFilter';

type TalentSearchFormProps = {
  values: TalentFilterValues;
  onSearch: (values: TalentFilterValues) => void;
};

export default function TalentSearchForm({
  values,
  onSearch,
}: TalentSearchFormProps) {
  const t = useTranslations('companyPage.talent-database');
  const schema = useMemo(
    () => createTalentSearchSchema(t('salary-range-error')),
    [t],
  );
  const form = useForm<TalentFilterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      relocation: 'yes',
      'driving-license': 'yes',
      ...values,
    },
  });
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSearch)}
        className="bg-card flex flex-col gap-5 rounded-2xl px-4 py-6 shadow-sm md:px-10 md:pt-12 md:pb-8"
      >
        <h1 className="sr-only">{t('title')}</h1>
        <TalentFilterSection title={t('sections.occupational')}>
          <TalentFilterFields fields={occupationalFields} />
        </TalentFilterSection>
        <TalentFilterSection title={t('sections.qualifications')}>
          <div className="space-y-5">
            <section>
              <h3 className="text-muted-foreground mb-3 text-sm">
                {t('sections.experience')}
              </h3>
              <TalentFilterFields fields={experienceFields} />
            </section>
            <section>
              <h3 className="text-muted-foreground mb-3 text-sm">
                {t('sections.licensing')}
              </h3>
              <TalentFilterFields fields={licensingFields} />
            </section>
            <section>
              <h3 className="text-muted-foreground mb-3 text-sm">
                {t('sections.languages')}
              </h3>
              <TalentFilterFields
                fields={languageFields}
                className="md:grid-cols-2"
              />
            </section>
          </div>
        </TalentFilterSection>
        <TalentFilterSection title={t('sections.mobility')}>
          <TalentMobilityFilters />
        </TalentFilterSection>
        <TalentFilterSection title={t('sections.career')}>
          <TalentFilterFields fields={careerFields} />
        </TalentFilterSection>
        <TalentFilterSection title={t('sections.personal')}>
          <TalentFilterFields fields={personalFields} />
        </TalentFilterSection>
        <TalentFilterSection title={t('sections.salary')}>
          <TalentSalaryFilters />
        </TalentFilterSection>
        <TalentFilterSection title={t('sections.employment')}>
          <div className="space-y-5">
            <TalentFilterFields fields={employmentFields} />
            <TalentKeywordFilter />
          </div>
        </TalentFilterSection>
        <TalentFilterSection title={t('sections.availability')}>
          <TalentFilterFields fields={availabilityFields} />
        </TalentFilterSection>  
        <div className="flex flex-wrap justify-center gap-3 pt-1">
  
          <Button type="submit" size="pill" className="min-w-56">
            {t('search')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
