import { getBaseApiUrl } from "../lib/api-endpoints";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetExperiences(search = "") {
    const query = useInfiniteQuery({
        queryKey: ["experiences", search],
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

            const res = await fetch(`${getBaseApiUrl()}/experiences?${params.toString()}`);

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
        }
    });

    return {
        ...query,
        experiences: query.data?.pages.flatMap((page) => page.data) ?? [],
    };
}
