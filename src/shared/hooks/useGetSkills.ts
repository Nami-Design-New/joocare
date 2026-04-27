import { useInfiniteQuery } from "@tanstack/react-query";
import { getBaseApiUrl } from "../lib/api-endpoints";

export default function useGetSkills(search = "", job_title_id = "") {
  const trimmedSearch = search.trim();
  const query = useInfiniteQuery({
    queryKey: ["skills", trimmedSearch, job_title_id],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      params.set("pagination", "on");
      params.set("limit_per_page", "10");

      if (job_title_id) {
        params.set("job_title_id", job_title_id);
      }

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      }

      const res = await fetch(`${getBaseApiUrl()}/skills?${params.toString()}`);

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
    skills: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
