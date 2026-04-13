import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type { FaqsApiResponse, FaqsPageData } from "./types";
import { mapFaqItem } from "./utils";

export async function getFaqsPageData(
  locale: string,
  page: number,
): Promise<FaqsPageData> {
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: "10",
    page: String(page),
  });

  const { ok, data, message } = await apiFetch<FaqsApiResponse>(
    `${getBaseApiUrl()}/faqs?${params.toString()}`,
    {
      method: "GET",
      locale,
      cache: "no-store",
    },
  );

  if (!ok || !data) {
    throw new Error(message || "Failed to load FAQs.");
  }

  return {
    items: data.data?.map(mapFaqItem) ?? [],
    currentPage: data.current_page ?? page,
    totalPages: data.last_page ?? 1,
    pageSize: data.per_page ?? 10,
    totalItems: data.total ?? 0,
  };
}
