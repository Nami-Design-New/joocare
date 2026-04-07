import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetCitiesByCountryId(countryId: number) {
    const query = useInfiniteQuery({
        queryKey: ["cities-by-country-id", countryId],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/cities?page=${pageParam}&pagination=on&limit_per_page=10&country_id=${countryId}`
            );

            if (!res.ok) {
                throw new Error("Network error");
            }

            const data = await res.json();

            if (data.code !== 200) {
                throw new Error(data.message || "Something went wrong");
            }

            return data;
        },
        enabled: !!countryId,
        getNextPageParam: (lastPage) => {
            if (!lastPage?.next_page_url) return undefined;

            const url = new URL(lastPage.next_page_url);
            return Number(url.searchParams.get("page"));
        }
    });

    return {
        ...query,
        cities: query.data?.pages.flatMap((page) => page.data) ?? [],
    };
}
