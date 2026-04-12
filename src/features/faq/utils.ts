import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import type { FaqApiItem, FaqItem } from "./types";

export function normalizeFaqPageParam(value: string | string[] | undefined) {
  const resolvedValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number.parseInt(resolvedValue ?? "1", 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

export function buildFaqPagePath(locale: string, page: number) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return `/${locale}/faq${queryString ? `?${queryString}` : ""}`;
}

export function getFaqPageCopy(locale: string, page: number) {
  if (locale === "ar") {
    return {
      title: page > 1 ? `الأسئلة الشائعة - صفحة ${page}` : "الأسئلة الشائعة",
      description:
        "تصفح الأسئلة الشائعة على جيوكير لمعرفة إجابات واضحة حول التقديم على الوظائف، إنشاء حسابات الشركات، وإدارة الملف الشخصي.",
      heading: "FAQ",
      tryTitle: "Try it now",
    };
  }

  return {
    title: page > 1 ? `FAQs - Page ${page}` : "FAQs",
    description:
      "Browse Joocare frequently asked questions about job applications, company hiring, profile management, and platform support.",
    heading: "FAQ",
    tryTitle: "Try it now",
  };
}

export function getSiteOrigin() {
  return getBaseApiUrl().replace(/\/api\/?$/, "");
}

export function mapFaqItem(item: FaqApiItem): FaqItem {
  return {
    id: String(item.id ?? ""),
    question: item.question ?? "",
    answer: item.answer ?? "",
  };
}

export function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}
