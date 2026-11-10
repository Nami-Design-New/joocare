'use client';

import { useTranslations } from 'next-intl';
import FormSelectField, { type StringFieldName } from './FormSelectField';

type OptionsSelectFieldProps = {
  name: StringFieldName;
  label: string;
  placeholder: string;
  /** Option keys, translated from `candidatePage.additional-info.options`. */
  options: readonly string[];
};

// Select with fixed, translated choices (gender, statuses, ...).
export default function OptionsSelectField({
  options,
  ...props
}: OptionsSelectFieldProps) {
  const t = useTranslations('candidatePage.additional-info.options');
  return (
    <FormSelectField
      {...props}
      options={options.map((value) => ({ value, label: t(value) }))}
    />
  );
}
