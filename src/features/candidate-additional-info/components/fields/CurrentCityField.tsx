'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import useGetCitiesByCountryId from '@/shared/hooks/useGetCitiesByCountryId';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import { toLookupField } from '../../utils/lookup-field';
import FormSelectField from './FormSelectField';

// Cities of the selected current country.
export default function CurrentCityField() {
  const t = useTranslations('candidatePage.additional-info');
  const { control } = useFormContext<AdditionalInfoValues>();
  const countryId = useWatch({ control, name: 'currentCountry' });
  const [search, setSearch] = useState('');
  const query = useGetCitiesByCountryId(Number(countryId), search);
  const lookup = toLookupField(query, query.cities);

  return (
    <FormSelectField
      name="currentCity"
      label={t('fields.current-city')}
      placeholder={t(
        countryId ? 'placeholders.select' : 'placeholders.select-country-first',
      )}
      {...lookup}
      disabled={!countryId || lookup.disabled}
      onSearchChange={setSearch}
    />
  );
}
