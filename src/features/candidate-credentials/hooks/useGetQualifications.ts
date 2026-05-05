"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { extractQualificationItems, mapQualification } from "../services/qualification-utils";
import type { QualificationViewModel } from "../types/qualification.types";

type QualificationsPageResponse = {
  code?: number;
  message?: string;
  next_page_url?: string | null;
  data?: unknown;
};

export const qualificationsQueryKey = (locale: string) => [
  "candidate-qualifications",
  locale,

];

export const qualificationsQueryKeyPrefix = (locale: string) => [
  "candidate-qualifications",
  locale,
];

export default function useGetQualifications() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const query = useInfiniteQuery({
    queryKey: qualificationsQueryKey(locale),
    initialPageParam: 1,
    enabled: status === "authenticated" && Boolean(token),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        pagination: "on",
        limit_per_page: "10",
      });

      const { data, ok, message } = await apiFetch<unknown>(
        `${getUserApiUrl()}/qualifications?${params.toString()}`,
        {
          method: "GET",
          locale,
          token,
        },
      );

      if (!ok) {
        throw new Error(message || "Failed to load qualifications.");
      }

      return (data ?? {}) as QualificationsPageResponse;
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
    qualifications:
      query.data?.pages.flatMap((page) =>
        extractQualificationItems(page).map(mapQualification).filter(Boolean),
      )?.filter((item): item is QualificationViewModel => Boolean(item)) ?? [],
  };
}
