import { useInfiniteLookup } from './useInfiniteLookup';

export default function useGetSeniorityLevels(
  search = '',
  roleCategoryIds: number[] = [],
) {
  const normalizedRoleCategoryIds = roleCategoryIds.filter((id) => id > 0);

  const query = useInfiniteLookup({
    endpoint: 'seniority-levels',
    queryKey: 'seniority-levels',
    search,
    limitPerPage: 100,
    extraParams: {
      'role_category_ids[]': normalizedRoleCategoryIds,
    },
    enabled: normalizedRoleCategoryIds.length > 0,
  });

  return {
    ...query,
    seniorityLevels: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
