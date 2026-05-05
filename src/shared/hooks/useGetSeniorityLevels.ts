import { useInfiniteLookup } from "./useInfiniteLookup";

export default function useGetSeniorityLevels(
  search = "",
  roleCategoryId?: number,
) {
  const query = useInfiniteLookup({
    endpoint: "seniority-levels",
    queryKey: "seniority-levels",
    search,
    extraParams: {
      role_category_id: roleCategoryId,
    },
    enabled: !roleCategoryId || roleCategoryId > 0,
  });

  return {
    ...query,
    seniorityLevels: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
