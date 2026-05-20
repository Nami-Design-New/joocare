import { useInfiniteQuery } from "@tanstack/react-query";
import { getBaseApiUrl } from "../lib/api-endpoints";
import { getTimeZone } from "../lib/fetch-manager";
import { useLocale } from "next-intl";

export default function useGetCategories(search = "") {
  const locale = useLocale();
  const query = useInfiniteQuery({
    queryKey: ["categories", locale, search],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        pagination: "on",
        limit_per_page: "10",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`${getBaseApiUrl()}/categories?${params.toString()}`, {
        headers: {
          "X-Timezone": getTimeZone(),
          "Accept-Language": locale,
        }
      });

      if (!res.ok) {
        throw new Error("Network error");
      }

      const data = await res.json();

      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next_page_url) return undefined;

      const url = new URL(lastPage.next_page_url);
      const page = Number(url.searchParams.get("page"));
      return Number.isNaN(page) ? undefined : page;
    },
  });

  return {
    ...query,
    categories: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
