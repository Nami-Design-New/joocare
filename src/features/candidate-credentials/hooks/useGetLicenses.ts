"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { extractLicenseItems, mapLicense } from "../services/license-utils";
import type { LicenseViewModel } from "../types/license.types";

type LicensesPageResponse = {
  code?: number;
  message?: string;
  next_page_url?: string | null;
  data?: unknown;
};

export const licensesQueryKey = (locale: string,) => [
  "candidate-licenses",
  locale,

];

export const licensesQueryKeyPrefix = (locale: string) => ["candidate-licenses", locale];

export default function useGetLicenses() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const query = useInfiniteQuery({
    queryKey: licensesQueryKey(locale,),
    initialPageParam: 1,
    enabled: status === "authenticated" && Boolean(token),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        pagination: "on",
        limit_per_page: "10",
      });

      const { data, ok, message } = await apiFetch<unknown>(
        `${getUserApiUrl()}/user-licenses?${params.toString()}`,
        {
          method: "GET",
          locale,
          token,
        },
      );

      if (!ok) {
        throw new Error(message || "Failed to load licenses.");
      }

      return (data ?? {}) as LicensesPageResponse;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next_page_url) {
        return undefined;
      }

      const url = new URL(lastPage.next_page_url);
      const page = Number(url.searchParams.get("page"));
      return Number.isNaN(page) ? undefined : page;
    },
  });

  return {
    ...query,
    isInitialLoading:
      status === "loading" ||
      (status === "authenticated" && query.isFetching && !query.data),
    licenses:
      query.data?.pages
        .flatMap((page) => extractLicenseItems(page).map(mapLicense).filter(Boolean))
        .filter((item): item is LicenseViewModel => Boolean(item)) ?? [],
  };
}
