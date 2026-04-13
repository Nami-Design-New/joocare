import { useInfiniteLookup } from "./useInfiniteLookup";

export default function useGetAvailabilities(search = "") {
  const query = useInfiniteLookup({
    endpoint: "availabilities",
    queryKey: "availabilities",
    search,
  });

  return {
    ...query,
    availabilities: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
