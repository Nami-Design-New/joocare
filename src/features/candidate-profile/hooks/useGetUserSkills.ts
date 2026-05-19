import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { getTimeZone } from "@/shared/lib/fetch-manager";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export default function useGetUserSkills(search = "", job_title_id = "", token = "") {
  const locale = useLocale();
  const trimmedSearch = search.trim();

  const query = useInfiniteQuery({
    queryKey: ["user-skills", trimmedSearch, job_title_id],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      params.set("pagination", "on");
      params.set("limit_per_page", "10");

      if (job_title_id) params.set("job_title_id", job_title_id);
      if (trimmedSearch) params.set("search", trimmedSearch);

      const res = await fetch(`${getUserApiUrl()}/user-skills?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Timezone": getTimeZone(),
          "Accept-Language": locale,
        },
      });

      if (!res.ok) throw new Error("Network error");

      return await res.json();
    },
    enabled: !!token,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next_page_url) return undefined;
      const url = new URL(lastPage.next_page_url);
      const page = Number(url.searchParams.get("page"));
      return Number.isNaN(page) ? undefined : page;
    },
  });

  const lastPage = query.data?.pages.at(-1);

  return {
    data: query.data?.pages.flatMap((page) => page.data) ?? [],
    total: lastPage?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
