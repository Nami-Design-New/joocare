'use client';

import { useCallback } from 'react';
import type { Option } from '@/shared/components/SelectInputField';
import type { ProfileDetails } from '../types/profile-details.types';
import {
  type SavedOptions,
  toSavedOptions,
} from '../utils/profile-details-mapper';
import useGetProfileDetails from './useGetProfileDetails';

const NO_OPTIONS: Option[] = [];

// Saved choices of one field, read from the cached profile details query, so a
// select can show a saved value that isn't in the options it has loaded yet.
export function useSavedOptions(name: string): Option[] {
  const select = useCallback(
    (details: ProfileDetails) =>
      toSavedOptions(details)[name as keyof SavedOptions] ?? NO_OPTIONS,
    [name],
  );
  const { data } = useGetProfileDetails(select);
  return data ?? NO_OPTIONS;
}
