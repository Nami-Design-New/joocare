import { useInfiniteLookup } from "./useInfiniteLookup";

export default function useGetSeniorityLevels(search = "") {
  const query = useInfiniteLookup({
    endpoint: "seniority-levels",
    queryKey: "seniority-levels",
    search,
  });

  return {
    ...query,
    seniorityLevels: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
