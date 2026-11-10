'use client';

import { useState } from 'react';
import type { LookupHook } from '../../hooks/useLookupOptions';
import FormSelectField, { type StringFieldName } from './FormSelectField';

type LookupSelectFieldProps = {
  name: StringFieldName;
  label?: string;
  placeholder: string;
  useLookup: LookupHook;
  className?: string;
  containerStyles?: string;
  onValueChange?: (value: string) => void;
};

// Searchable, paginated select backed by an API lookup.
export default function LookupSelectField({
  useLookup,
  ...props
}: LookupSelectFieldProps) {
  const [search, setSearch] = useState('');
  const lookup = useLookup(search);
  return <FormSelectField {...props} {...lookup} onSearchChange={setSearch} />;
}
