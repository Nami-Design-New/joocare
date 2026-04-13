import { useInfiniteLookup } from "./useInfiniteLookup";

export default function useGetEmploymentTypes(search = "") {
  const query = useInfiniteLookup({
    endpoint: "employment-types",
    queryKey: "employment-types",
    search,
  });

  return {
    ...query,
    employmentTypes: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
