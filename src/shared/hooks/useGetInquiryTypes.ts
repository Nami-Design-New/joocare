import { useInfiniteLookup } from "./useInfiniteLookup";

export default function useGetInquiryTypes(search = "") {
  const query = useInfiniteLookup({
    endpoint: "inquiry-types",
    queryKey: "inquiry-types",
    search,
  });

  return {
    ...query,
    inquiryTypes: query.data?.pages.flatMap((page) => page.data ?? []) ?? [],
  };
}
