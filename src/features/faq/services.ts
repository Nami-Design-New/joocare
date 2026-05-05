import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type { FaqApiItem, FaqsApiResponse, FaqsPageData, RequiredFaqsApiResponse } from "./types";
import { mapFaqItem } from "./utils";

export async function getFaqsPageData(
  locale: string,
  page: number,
  faqAudience?: "employees" | "companies",
): Promise<FaqsPageData> {
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: "10",
    page: String(page),
    is_for: faqAudience ? faqAudience : "employees",
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
  const safeData = data as RequiredFaqsApiResponse;
  return {
    items: safeData.data.map(mapFaqItem),
    currentPage: safeData.current_page,
    totalPages: safeData.last_page,
    pageSize: safeData.per_page,
    totalItems: safeData.total,
  };
}
