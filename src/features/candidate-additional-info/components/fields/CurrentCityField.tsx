'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import useGetCitiesByCountryId from '@/shared/hooks/useGetCitiesByCountryId';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import { useSavedOptions } from '../../hooks/useSavedOptions';
import { toLookupField, withSavedOptions } from '../../utils/lookup-field';
import FormSelectField from './FormSelectField';
import LookupError from './LookupError';

// Cities of the selected current country.
export default function CurrentCityField() {
  const t = useTranslations('candidatePage.additional-info');
  const { control } = useFormContext<AdditionalInfoValues>();
  const countryId = useWatch({ control, name: 'currentCountry' });
  const [search, setSearch] = useState('');
  const query = useGetCitiesByCountryId(Number(countryId), search);
  const { isError, ...lookup } = toLookupField(query, query.cities);
  const savedCities = useSavedOptions('currentCity');
  const savedCountryId = useSavedOptions('currentCountry')[0]?.value;
  // The saved city only belongs in the list of the saved country.
  const saved = !search && countryId === savedCountryId ? savedCities : [];

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <FormSelectField
        name="currentCity"
        label={t('fields.current-city')}
        placeholder={t(
          countryId
            ? 'placeholders.select'
            : 'placeholders.select-country-first',
        )}
        {...lookup}
        options={withSavedOptions(lookup.options, saved)}
        disabled={!countryId || lookup.disabled}
        onSearchChange={setSearch}
      />
      {isError && <LookupError />}
    </div>
  );
}
