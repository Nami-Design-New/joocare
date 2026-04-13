import { useInfiniteLookup } from "./useInfiniteLookup";

export default function useGetSalaryTypes(search = "") {
  const query = useInfiniteLookup({
    endpoint: "salary-types",
    queryKey: "salary-types",
    search,
  });

  return {
    ...query,
    salaryTypes: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
