'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import EducationFormModal, {
  type EducationCountryField,
} from '@/shared/components/modals/EducationFormModal';
import type { Option } from '@/shared/components/SelectInputField';
import useGetCountries from '@/shared/hooks/useGetCountries';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { emptyEducation } from '../../utils/cv-builder-defaults';
import { createCvEducationSchema } from '../../validation/cv-builder-schema';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvAddButton from '../wizard/CvAddButton';
import CvRepeatableList from '../wizard/CvRepeatableList';
import CvStepCard from '../wizard/CvStepCard';

type CvEducation = CvBuilderValues['educations'][number];

function withSavedCountry(options: Option[], education?: CvEducation) {
  const value = education?.country;
  const label = education?.countryLabel;
  return value && label && !options.some((option) => option.value === value)
    ? [{ value, label }, ...options]
    : options;
}

// Shared Education modal with CV country lookups and month dates.
function CvEducationModal({
  title,
  onAdd,
  onClose,
  countryField,
}: {
  title: string;
  onAdd: (item: CvEducation) => void;
  onClose: () => void;
  countryField: EducationCountryField;
}) {
  const tWizard = useTranslations('candidatePage.buildCv.wizard');
  const tErrors = useTranslations('candidatePage.buildCv.errors');
  const schema = useMemo(
    () =>
      createCvEducationSchema({
        required: tErrors('required'),
        invalidGpa: tErrors('invalid-gpa'),
      }),
    [tErrors],
  );

  return (
    <EducationFormModal
      open
      onOpenChange={(open) => !open && onClose()}
      title={title}
      submitLabel={tWizard('add')}
      schema={schema}
      dateType="month"
      countryField={countryField}
      onSubmit={(values) => {
        onAdd({
          ...values,
          countryLabel:
            countryField.options.find(
              (option) => option.value === values.country,
            )?.label ?? '',
        });
        onClose();
      }}
    />
  );
}

// Step 5: repeatable education entries.
export default function EducationStep() {
  const t = useTranslations('candidatePage.buildCv.education');
  const tOptions = useTranslations('candidatePage.buildCv.options');
  const { control, setValue } = useFormContext<CvBuilderValues>();
  const educations = useWatch({ control, name: 'educations' });
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
  const countryField: EducationCountryField = {
    options: countryOptions,
    isLoading: countries.isLoading,
    onSearchChange: setCountrySearch,
    onReachEnd: () => void countries.fetchNextPage(),
    hasNextPage: countries.hasNextPage,
    isFetchingNextPage: countries.isFetchingNextPage,
    clearOptionLabel: tOptions('clear-selection'),
  };

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <CvRepeatableList
        name="educations"
        getTitle={(number) => t('item', { number })}
        addTitle={t('add-title')}
        createItem={emptyEducation}
        renderAdd={(add) => (
          <CvAddButton variant="round" label={t('add')} onClick={add} />
        )}
        renderAddModal={({ onAdd, onClose }) => (
          <CvEducationModal
            title={t('add-title')}
            onAdd={onAdd}
            onClose={onClose}
            countryField={countryField}
          />
        )}
        renderFields={(index) => (
          <>
            <CvTextField
              name={`educations.${index}.degree`}
              label={t('degree')}
              placeholder={t('degree-placeholder')}
            />
            <CvTextField
              name={`educations.${index}.university`}
              label={t('university')}
              placeholder={t('university-placeholder')}
            />
            <CvTextField
              name={`educations.${index}.gpa`}
              label={t('gpa')}
              placeholder={t('gpa-placeholder')}
              inputMode="decimal"
            />
            <CvSelectField
              name={`educations.${index}.country`}
              label={t('country')}
              placeholder={t('country-placeholder')}
              options={withSavedCountry(countryOptions, educations[index])}
              disabled={countries.isLoading}
              onSelectionChange={(option) =>
                setValue(
                  `educations.${index}.countryLabel`,
                  option?.label ?? '',
                )
              }
              withSearchInput
              onSearchChange={setCountrySearch}
              clearable
              onReachEnd={() => void countries.fetchNextPage()}
              hasNextPage={countries.hasNextPage}
              isFetchingNextPage={countries.isFetchingNextPage}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <CvTextField
                name={`educations.${index}.startDate`}
                type="month"
                label={t('start-date')}
              />
              <CvTextField
                name={`educations.${index}.endDate`}
                type="month"
                label={t('end-date')}
              />
            </div>
          </>
        )}
      />
    </CvStepCard>
  );
}
