import type { Option } from '@/shared/components/SelectInputField';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import type { LookupOptionSource } from '@/features/candidate-profile/types/profile.types';

type LookupQuery = {
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

export type LookupFieldProps = {
  options: Option[];
  disabled: boolean;
  onReachEnd: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

// Maps an infinite lookup query to the paging props of the select fields.
export function toLookupField(
  query: LookupQuery,
  items: LookupOptionSource[],
  toOption: (items: LookupOptionSource[]) => Option[] = toLookupOptions,
): LookupFieldProps {
  return {
    options: toOption(items),
    disabled: query.isLoading,
    onReachEnd: () => {
      if (query.hasNextPage) void query.fetchNextPage();
    },
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
