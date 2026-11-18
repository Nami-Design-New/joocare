'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  useCountryLookup,
  useGenderLookup,
  useMaritalStatusLookup,
  useReligionLookup,
  useSponsorshipLookup,
  useVisaStatusLookup,
} from '../../hooks/useLookupOptions';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import CurrentCityField from '../fields/CurrentCityField';
import LookupMultiSelectField from '../fields/LookupMultiSelectField';
import LookupSelectField from '../fields/LookupSelectField';
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
        <LookupSelectField
          name="visaStatus"
          label={t('fields.visa-status')}
          placeholder={t('placeholders.select')}
          useLookup={useVisaStatusLookup}
          searchable={false}
        />
        <LookupSelectField
          name="gender"
          label={t('fields.gender')}
          placeholder={t('placeholders.select')}
          useLookup={useGenderLookup}
          searchable={false}
        />
        <CurrentCityField />
        <LookupMultiSelectField
          name="sponsorship"
          label={t('fields.sponsorship')}
          placeholder={t('placeholders.select')}
          useLookup={useSponsorshipLookup}
        />
        <LookupSelectField
          name="maritalStatus"
          label={t('fields.marital-status')}
          placeholder={t('placeholders.select-marital-status')}
          useLookup={useMaritalStatusLookup}
          searchable={false}
        />
        <LookupSelectField
          name="religion"
          label={t('fields.religion')}
          placeholder={t('placeholders.select-religion')}
          useLookup={useReligionLookup}
        />
      </div>
    </InfoSection>
  );
}
