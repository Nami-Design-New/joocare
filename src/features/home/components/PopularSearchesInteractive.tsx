"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import PopularSearches, { type PopularSearchesItem } from "./PopularSearches";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  items: PopularSearchesItem[];
  variant: "hero" | "jobs";
  maxVisible?: number;
}

export default function PopularSearchesInteractive({
  items,
  variant,
  maxVisible,
}: Props) {
  const router = useRouter();
  const t = useTranslations("Home");
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = (item: PopularSearchesItem) => {
    if (variant === "hero") {
      router.push(`/jobs?search=${encodeURIComponent(item.label)}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", item.label);
      router.replace(`/jobs?${params.toString()}`);
    }
  };

  return (
    <PopularSearches
      items={items}
      title={t("popularSearches")}
      maxVisible={isExpanded ? undefined : maxVisible}
      onItemClick={handleItemClick}
      onShowMore={() => setIsExpanded(true)}
      onShowLess={() => setIsExpanded(false)}
      isExpanded={isExpanded}
      showMoreLabel={t("showMore")}
      showLessLabel={t("showLess")}
    />
  );
}
