'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { useCurrencyLookup } from '../../hooks/useLookupOptions';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import CurrencySymbol from '../fields/CurrencySymbol';
import { FIELD_CLASS_NAME } from '../fields/FormSelectField';
import LookupSelectField from '../fields/LookupSelectField';
import InfoSection from '../InfoSection';
import InfoSubsection from '../InfoSubsection';

export default function SalarySection() {
  const t = useTranslations('candidatePage.additional-info');
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AdditionalInfoValues>();
  const [currentCurrency, expectedCurrency] = useWatch({
    control,
    name: ['currentCurrency', 'expectedCurrency'],
  });

  return (
    <InfoSection section="salary">
      <InfoSubsection title={t('fields.current-salary')}>
        <div className="flex flex-col gap-1">
          <div className="bg-card border-border focus-within:border-ring focus-within:ring-ring/50 flex h-13 items-center gap-3 rounded-full border ps-4 pe-1 focus-within:ring-[3px]">
            <input
              id="currentSalary"
              inputMode="decimal"
              aria-label={t('fields.current-salary')}
              aria-invalid={Boolean(errors.currentSalary)}
              placeholder={t('placeholders.current-salary')}
              className="placeholder:text-muted-foreground/60 h-full min-w-0 flex-1 bg-transparent text-base outline-none"
              {...register('currentSalary')}
            />
            <CurrencySymbol currencyId={currentCurrency} />
            <span aria-hidden className="bg-foreground/5 h-9 w-px" />
            <LookupSelectField
              name="currentCurrency"
              placeholder={t('fields.currency')}
              useLookup={useCurrencyLookup}
              containerStyles="w-auto"
              className="h-11 w-24 border-0 bg-transparent px-3 text-[13px] font-semibold shadow-none"
            />
          </div>
          {errors.currentSalary && (
            <p className="text-destructive mx-1 text-sm">
              {errors.currentSalary.message}
            </p>
          )}
        </div>
      </InfoSubsection>
      <InfoSubsection title={t('fields.expected-salary')}>
        <div className="flex flex-col items-start gap-5 sm:flex-row">
          {(['expectedMin', 'expectedMax'] as const).map((name) => (
            <InputField
              key={name}
              id={name}
              inputMode="decimal"
              aria-label={t(`placeholders.${name}`)}
              placeholder={t(`placeholders.${name}`)}
              error={errors[name]?.message}
              icon={<CurrencySymbol currencyId={expectedCurrency} />}
              className={FIELD_CLASS_NAME}
              {...register(name)}
            />
          ))}
          <LookupSelectField
            name="expectedCurrency"
            placeholder={t('fields.currency')}
            useLookup={useCurrencyLookup}
            containerStyles="w-auto shrink-0"
            className="bg-secondary text-secondary-foreground h-13 w-24 border-0 px-5 text-[13px] font-semibold shadow-none [&_[data-slot=combobox-trigger-icon]]:text-secondary-foreground"
          />
        </div>
      </InfoSubsection>
    </InfoSection>
  );
}
