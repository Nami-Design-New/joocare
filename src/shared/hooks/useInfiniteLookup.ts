import { useInfiniteQuery } from "@tanstack/react-query";

import { getBaseApiUrl } from "../lib/api-endpoints";
import { getTimeZone } from "../lib/fetch-manager";

type InfiniteLookupOptions = {
  endpoint: string;
  queryKey: string;
  search?: string;
  limitPerPage?: number;
  extraParams?: Record<
    string,
    string | number | Array<string | number> | undefined | null
  >;
  enabled?: boolean;
};

export function useInfiniteLookup({
  endpoint,
  queryKey,
  search = "",
  limitPerPage = 10,
  extraParams,
  enabled = true,
}: InfiniteLookupOptions) {
  return useInfiniteQuery({
    queryKey: [queryKey, search, limitPerPage, extraParams],
    initialPageParam: 1,
    enabled,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        pagination: "on",
        limit_per_page: String(limitPerPage),
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      Object.entries(extraParams ?? {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            const normalizedItem = String(item).trim();
            if (normalizedItem) {
              params.append(key, normalizedItem);
            }
          });
          return;
        }

        if (value !== undefined && value !== null && String(value).trim()) {
          params.set(key, String(value));
        }
      });

      const res = await fetch(`${getBaseApiUrl()}/${endpoint}?${params.toString()}`, {
        headers: {
          "X-Timezone": getTimeZone(),
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
}
