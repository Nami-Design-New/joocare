"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import PopularSearches, { type PopularSearchesItem } from "./PopularSearches";
import { getTimeZone } from "@/shared/lib/fetch-manager";

interface Props {
  items: PopularSearchesItem[];
  variant: "hero" | "jobs";
  maxVisible?: number;
  currentPage?: number;
  lastPage?: number;
}

export default function PopularSearchesInteractive({
  items,
  variant,
  maxVisible,
  currentPage = 1,
  lastPage = 1,
}: Props) {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedItems, setLoadedItems] = useState(items);
  const [page, setPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(lastPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setLoadedItems(items);
    setPage(currentPage);
    setTotalPages(lastPage);
  }, [items, currentPage, lastPage]);

  const handleItemClick = (item: PopularSearchesItem) => {
    if (variant === "hero") {
      router.push(`/jobs?search=${encodeURIComponent(item.label)}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", item.label);
      router.replace(`/jobs?${params.toString()}`);
    }
  };

  const handleShowMore = async () => {
    if (isLoadingMore) {
      return;
    }

    setIsExpanded(true);

    if (page < totalPages) {
      setIsLoadingMore(true);

      try {
        let nextPage = page;
        let nextLastPage = totalPages;
        const appendedItems: PopularSearchesItem[] = [];

        while (nextPage < nextLastPage) {
          const targetPage = nextPage + 1;
          const nextParams = new URLSearchParams({
            page: String(targetPage),
            limit_per_page: "10",
          });

          if (typeof params?.locale === "string" && params.locale) {
            nextParams.set("locale", params.locale);
          }

          const response = await fetch(`/api/searches?${nextParams.toString()}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-Timezone": getTimeZone(),
              "Accept-Language":
                (typeof params?.locale === "string" && params.locale ? params.locale : "en"),
            },
          });

          if (!response.ok) {
            throw new Error("Failed to load more popular searches.");
          }

          const data = (await response.json()) as {
            items?: PopularSearchesItem[];
            currentPage?: number;
            lastPage?: number;
          };

          appendedItems.push(...(data.items ?? []));
          nextPage = data.currentPage ?? targetPage;
          nextLastPage = data.lastPage ?? nextLastPage;
        }

        setLoadedItems((current) => [
          ...current,
          ...appendedItems.filter(
            (item) =>
              item.label &&
              !current.some((existing) => existing.id === item.id),
          ),
        ]);
        setPage(nextPage);
        setTotalPages(nextLastPage);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const handleShowLess = () => {
    setIsExpanded(false);
  };

  return (
    <PopularSearches
      items={loadedItems}
      maxVisible={isExpanded ? undefined : maxVisible}
      onItemClick={handleItemClick}
      onShowMore={handleShowMore}
      onShowLess={handleShowLess}
      isExpanded={isExpanded}
      isLoadingMore={isLoadingMore}
    />
  );
}
