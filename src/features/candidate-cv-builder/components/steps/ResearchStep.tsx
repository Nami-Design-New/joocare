'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import useGetCountries from '@/shared/hooks/useGetCountries';
import { PUBLICATION_YEAR_OPTIONS } from '../../constants/cv-builder-options';
import { emptyPublication } from '../../utils/cv-builder-defaults';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvStepCard from '../wizard/CvStepCard';
import CvSwitchEntries from '../wizard/CvSwitchEntries';

// Step 9: research papers and publications (optional).
export default function ResearchStep() {
  const t = useTranslations('candidatePage.buildCv.research');
  const [countrySearch, setCountrySearch] = useState('');
  const countries = useGetCountries(countrySearch);
  const countryOptions = useMemo(
    () =>
      countries.countries
        .map((country) => ({
          label: String(country.title ?? country.name ?? ''),
          value: String(country.id ?? ''),
        }))
        .filter((country) => country.label && country.value),
    [countries.countries],
  );

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <CvSwitchEntries
        section="research"
        title={t('toggle')}
        description={t('toggle-description')}
        addLabel={t('add')}
        removeLabel={t('remove')}
        createItem={emptyPublication}
        renderFields={(index) => (
          <>
            <CvTextField
              name={`research.items.${index}.title`}
              label={t('subject')}
              placeholder={t('subject-placeholder')}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <CvTextField
                name={`research.items.${index}.link`}
                type="url"
                label={t('link')}
                placeholder={t('link-placeholder')}
              />
              <CvSelectField
                name={`research.items.${index}.country`}
                label={t('country')}
                placeholder={t('country-placeholder')}
                options={countryOptions}
                disabled={countries.isLoading}
                withSearchInput
                onSearchChange={setCountrySearch}
                clearable
                onReachEnd={() => void countries.fetchNextPage()}
                hasNextPage={countries.hasNextPage}
                isFetchingNextPage={countries.isFetchingNextPage}
              />
            </div>
            <CvSelectField
              name={`research.items.${index}.year`}
              label={t('year')}
              placeholder={t('year-placeholder')}
              options={PUBLICATION_YEAR_OPTIONS}
              withSearchInput
              clearable
            />
          </>
        )}
      />
    </CvStepCard>
  );
}
