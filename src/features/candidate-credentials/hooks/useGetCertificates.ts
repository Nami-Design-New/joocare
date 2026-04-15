"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { extractCertificateItems, mapCertificate } from "../services/certificate-utils";
import type { CertificateViewModel } from "../types/certificate.types";

type CertificatesPageResponse = {
  code?: number;
  message?: string;
  next_page_url?: string | null;
  data?: unknown;
};

export const certificatesQueryKey = (locale: string,) => [
  "candidate-certificates",
  locale,

];

export const certificatesQueryKeyPrefix = (locale: string) => [
  "candidate-certificates",
  locale,
];

export default function useGetCertificates() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const query = useInfiniteQuery({
    queryKey: certificatesQueryKey(locale),
    initialPageParam: 1,
    enabled: status === "authenticated" && Boolean(token),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        pagination: "on",
        limit_per_page: "10",
      });

      const { data, ok, message } = await apiFetch<unknown>(
        `${getUserApiUrl()}/certifications?${params.toString()}`,
        {
          method: "GET",
          locale,
          token,
        },
      );

      if (!ok) {
        throw new Error(message || "Failed to load certificates.");
      }

      return (data ?? {}) as CertificatesPageResponse;
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
    certificates:
      query.data?.pages
        .flatMap((page) => extractCertificateItems(page).map(mapCertificate).filter(Boolean))
        .filter((item): item is CertificateViewModel => Boolean(item)) ?? [],
  };
}
