import type { Option } from '@/shared/components/SelectInputField';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import type { LookupOptionSource } from '@/features/candidate-profile/types/profile.types';

type LookupQuery = {
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

export type LookupFieldProps = {
  options: Option[];
  disabled: boolean;
  isError: boolean;
  onReachEnd: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

// Adds saved choices missing from the loaded options, so their labels still show.
export function withSavedOptions(options: Option[], saved: Option[]): Option[] {
  const loaded = new Set(options.map((option) => option.value));
  const missing = saved.filter((option) => !loaded.has(option.value));
  return missing.length ? [...options, ...missing] : options;
}

// Maps a fixed-choice lookup query (no paging) to the select field props.
export function toEnumLookupField(query: {
  data?: Option[];
  isLoading: boolean;
  isError: boolean;
}): LookupFieldProps {
  return {
    options: query.data ?? [],
    disabled: query.isLoading || query.isError,
    isError: query.isError,
    onReachEnd: () => undefined,
    hasNextPage: false,
    isFetchingNextPage: false,
  };
}

// Maps an infinite lookup query to the paging props of the select fields.
export function toLookupField(
  query: LookupQuery,
  items: LookupOptionSource[],
  toOption: (items: LookupOptionSource[]) => Option[] = toLookupOptions,
): LookupFieldProps {
  return {
    options: toOption(items),
    disabled: query.isLoading || query.isError,
    isError: query.isError,
    onReachEnd: () => {
      if (query.hasNextPage) void query.fetchNextPage();
    },
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
