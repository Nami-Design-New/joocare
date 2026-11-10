'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  GENDERS,
  MARITAL_STATUSES,
  SPONSORSHIP_OPTIONS,
  VISA_STATUSES,
} from '../../constants';
import { useCountryLookup } from '../../hooks/useLookupOptions';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import CurrentCityField from '../fields/CurrentCityField';
import LookupSelectField from '../fields/LookupSelectField';
import OptionsSelectField from '../fields/OptionsSelectField';
import InfoSection from '../InfoSection';

export default function PersonalDetailsSection() {
  const t = useTranslations('candidatePage.additional-info');
  const { setValue } = useFormContext<AdditionalInfoValues>();

  return (
    <InfoSection section="personal">
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
        <LookupSelectField
          name="nationality"
          label={t('fields.nationality')}
          placeholder={t('placeholders.select')}
          useLookup={useCountryLookup}
        />
        <LookupSelectField
          name="currentCountry"
          label={t('fields.current-country')}
          placeholder={t('placeholders.select')}
          useLookup={useCountryLookup}
          onValueChange={() => setValue('currentCity', '')}
        />
        <OptionsSelectField
          name="visaStatus"
          label={t('fields.visa-status')}
          placeholder={t('placeholders.select')}
          options={VISA_STATUSES}
        />
        <OptionsSelectField
          name="gender"
          label={t('fields.gender')}
          placeholder={t('placeholders.select')}
          options={GENDERS}
        />
        <CurrentCityField />
        <OptionsSelectField
          name="sponsorship"
          label={t('fields.sponsorship')}
          placeholder={t('placeholders.select')}
          options={SPONSORSHIP_OPTIONS}
        />
        <OptionsSelectField
          name="maritalStatus"
          label={t('fields.marital-status')}
          placeholder={t('placeholders.select-marital-status')}
          options={MARITAL_STATUSES}
        />
      </div>
    </InfoSection>
  );
}
