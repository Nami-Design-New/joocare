import { useInfiniteLookup } from "./useInfiniteLookup";

export default function useGetRoleCategories(search = "") {
  const query = useInfiniteLookup({
    endpoint: "role-categories",
    queryKey: "role-categories",
    search,
  });

  return {
    ...query,
    roleCategories: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
