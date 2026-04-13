import { useInfiniteQuery } from "@tanstack/react-query";

import { getBaseApiUrl } from "../lib/api-endpoints";

type InfiniteLookupOptions = {
  endpoint: string;
  queryKey: string;
  search?: string;
  extraParams?: Record<string, string | number | undefined | null>;
  enabled?: boolean;
};

export function useInfiniteLookup({
  endpoint,
  queryKey,
  search = "",
  extraParams,
  enabled = true,
}: InfiniteLookupOptions) {
  return useInfiniteQuery({
    queryKey: [queryKey, search, extraParams],
    initialPageParam: 1,
    enabled,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        pagination: "on",
        limit_per_page: "10",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      Object.entries(extraParams ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim()) {
          params.set(key, String(value));
        }
      });

      const res = await fetch(`${getBaseApiUrl()}/${endpoint}?${params.toString()}`);

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
}
