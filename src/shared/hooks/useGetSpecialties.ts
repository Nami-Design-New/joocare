import { getBaseApiUrl } from "../lib/api-endpoints";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetSpecialties(search = "", categoryId?: number) {
    const query = useInfiniteQuery({
        queryKey: ["specialties", search, categoryId],
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

            if (categoryId) {
                params.set("category_id", String(categoryId));
            }

            const res = await fetch(`${getBaseApiUrl()}/specialties?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Network error");
            }

            const data = await res.json();

            return data;
        },
        enabled: !categoryId || categoryId > 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage?.next_page_url) return undefined;

            const url = new URL(lastPage.next_page_url);
            const page = Number(url.searchParams.get("page"));
            return Number.isNaN(page) ? undefined : page;
        }
    });

    return {
        ...query,
        specialties: query.data?.pages.flatMap((page) => page.data) ?? [],
    };
}
