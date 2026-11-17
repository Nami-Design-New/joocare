'use client';

import { XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import { OTHER_OPTION } from '../../constants';
import type { LookupHook } from '../../hooks/useLookupOptions';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import { FIELD_CLASS_NAME } from './FormSelectField';
import LookupMultiSelectField from './LookupMultiSelectField';

type MultiSelectWithOtherFieldProps = {
  name: 'certifications' | 'professionalLicenseCountries';
  otherName: 'otherCertification' | 'otherLicenseCountry';
  label: string;
  placeholder: string;
  otherPlaceholder: string;
  useLookup: LookupHook;
};

// Multi-select with "Other" first; choosing "Other" turns the field into a text
// input, and its clear button brings the list back.
export default function MultiSelectWithOtherField({
  name,
  otherName,
  label,
  placeholder,
  otherPlaceholder,
  useLookup,
}: MultiSelectWithOtherFieldProps) {
  const t = useTranslations('candidatePage.additional-info.options');
  const { control, register, setValue, formState } =
    useFormContext<AdditionalInfoValues>();
  const selected = useWatch({ control, name });

  const backToList = () => {
    setValue(
      name,
      selected.filter((value) => value !== OTHER_OPTION),
      { shouldDirty: true },
    );
    setValue(otherName, '', { shouldDirty: true });
  };

  if (selected.includes(OTHER_OPTION)) {
    return (
      <InputField
        id={otherName}
        label={label}
        placeholder={otherPlaceholder}
        className={`${FIELD_CLASS_NAME} pe-10`}
        error={formState.errors[otherName]?.message}
        autoFocus
        icon={
          <button
            type="button"
            onClick={backToList}
            aria-label={t('back-to-list')}
            className="flex text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        }
        {...register(otherName)}
      />
    );
  }

  return (
    <LookupMultiSelectField
      name={name}
      label={label}
      placeholder={placeholder}
      useLookup={useLookup}
      leadingOptions={[{ value: OTHER_OPTION, label: t('other') }]}
    />
  );
}
